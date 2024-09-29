use crate::candle::CandleLLM;
use candle_core::Device;
use langchain_rust::{
    chain::{Chain, LLMChainBuilder},
    prompt::HumanMessagePromptTemplate,
    schemas::messages::Message,
};
use std::error::Error;
use tauri::Manager; // Import the custom CandleLLM module

// Command for querying the LLM via LangChain-Rust
#[tauri::command]
pub async fn query_llm(prompt: String) -> Result<String, String> {
    // Detect device (GPU vs CPU)
    let device = Device::new_cuda(0).unwrap_or_else(|_| Device::Cpu);

    // Load the Candle model and tokenizer
    let candle_llm = CandleLLM::new(
        "./models/llama-7b",       // Path to model
        "./models/tokenizer.json", // Path to tokenizer
        device,
    )
    .map_err(|e| e.to_string())?;

    // Define a system prompt and user prompt using LangChain
    let system_message =
        Message::new_system_message("You are an expert in answering technical questions.");
    let human_message = Message::new_human_message(&prompt);

    // Create a prompt template
    let prompt_template = HumanMessagePromptTemplate::new("{input}", "input");

    // Build the chain using LangChain-Rust
    let chain = LLMChainBuilder::new()
        .prompt(vec![system_message, human_message])
        .llm(move |input| candle_llm.generate(input)) // Use Candle for LLM inference
        .build()
        .unwrap();

    // Run the chain and get the result
    match chain.invoke(prompt).await {
        Ok(response) => Ok(response.to_string()),
        Err(err) => Err(format!("Chain error: {:?}", err)),
    }
}
