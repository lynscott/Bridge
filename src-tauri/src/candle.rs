use anyhow::{Error as E, Result};
use candle_core::{DType, Device, Tensor};
use candle_nn::VarBuilder;
use candle_transformers::generation::LogitsProcessor;
use candle_transformers::models::phi::Config as PhiConfig;
use candle_transformers::models::phi::Model as Phi;
use hf_hub::{api::sync::Api, Repo, RepoType};
use std::path::PathBuf;
use tokenizers::Tokenizer;

pub struct CandleLLM {
    model: Phi,
    device: Device,
    tokenizer: Tokenizer,
    logits_processor: LogitsProcessor,
}

impl CandleLLM {
    pub fn new(
        model_id: Option<String>,
        revision: Option<String>,
        seed: u64,
        temp: Option<f64>,
        top_p: Option<f64>,
        _cpu: bool,
    ) -> Result<Self> {
        let api = Api::new()?;
        let model_id = model_id.unwrap_or_else(|| "microsoft/Phi-3-mini-4k-instruct".to_string());
        let revision = revision.unwrap_or_else(|| "main".to_string());
        let repo = Repo::with_revision(model_id.clone(), RepoType::Model, revision.clone());

        // Download tokenizer
        let tokenizer_filename = api.get(
            &repo,
            "tokenizer.json",
            &hf_hub::api::CacheOptions::default(),
            &hf_hub::api::DownloadOptions::default(),
        )?;

        // Download config
        let config_filename = api.get(
            &repo,
            "config.json",
            &hf_hub::api::CacheOptions::default(),
            &hf_hub::api::DownloadOptions::default(),
        )?;
        let config_content = std::fs::read_to_string(config_filename)?;
        let config: PhiConfig = serde_json::from_str(&config_content)?;

        // Download model weights
        let filenames = download_model_files(&api, &repo)?;

        let device = Device::Cpu;
        let dtype = DType::F32;

        let vb = VarBuilder::from_mmaped_safetensors(&filenames, dtype, &device)?;
        let model = Phi::new(&config, vb)?;
        let tokenizer = Tokenizer::from_file(tokenizer_filename).map_err(E::msg)?;
        let logits_processor = LogitsProcessor::new(seed, temp, top_p);

        Ok(Self {
            model,
            device,
            tokenizer,
            logits_processor,
        })
    }

    pub fn generate(&mut self, prompt: &str, sample_len: usize) -> Result<String> {
        let encoding = self.tokenizer.encode(prompt, true).map_err(E::msg)?;
        let mut tokens = encoding.get_ids().to_vec();
        if tokens.is_empty() {
            anyhow::bail!("Empty prompts are not supported in the phi model.");
        }

        let mut generated_text = String::new();

        for _ in 0..sample_len {
            let input = Tensor::new(tokens.clone(), &self.device)?.unsqueeze(0)?;
            let logits = self.model.forward(&input)?;
            let logits = logits.squeeze(0)?;
            let logits = logits.to_dtype(DType::F32)?;

            let next_token = self.logits_processor.sample(&logits)?;
            tokens.push(next_token);

            if let Ok(t) = self.tokenizer.decode(&[next_token], true) {
                if !t.is_empty() {
                    generated_text.push_str(&t);
                }
            }
        }
        Ok(generated_text)
    }
}

fn download_model_files(api: &Api, repo: &Repo) -> Result<Vec<PathBuf>> {
    // Try to download the index file
    let index_filename = match api.get(
        repo,
        "model.safetensors.index.json",
        &hf_hub::api::CacheOptions::default(),
        &hf_hub::api::DownloadOptions::default(),
    ) {
        Ok(path) => path,
        Err(_) => {
            // If the index file doesn't exist, download the main model file
            let filename = api.get(
                repo,
                "model.safetensors",
                &hf_hub::api::CacheOptions::default(),
                &hf_hub::api::DownloadOptions::default(),
            )?;
            return Ok(vec![filename]);
        }
    };

    // Process the index file to get the list of weight files
    let index_content = std::fs::read_to_string(index_filename)?;
    let json: serde_json::Value = serde_json::from_str(&index_content)?;
    let weight_files = json["weight_map"]
        .as_object()
        .ok_or_else(|| E::msg("Invalid index file format"))?
        .values()
        .filter_map(|v| v.as_str())
        .collect::<std::collections::HashSet<_>>();

    let mut filenames = Vec::new();
    for file in weight_files {
        let filename = api.get(
            repo,
            file,
            &hf_hub::api::CacheOptions::default(),
            &hf_hub::api::DownloadOptions::default(),
        )?;
        filenames.push(filename);
    }

    Ok(filenames)
}
