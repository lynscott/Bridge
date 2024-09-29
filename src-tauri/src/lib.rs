// mod candle;
use anyhow::Result;
use dotenv::dotenv;
use keyring::Entry;
use langchain_rust::llm::OpenAIConfig;
use langchain_rust::{language_models::llm::LLM, llm::openai::OpenAI};
use std::env;

const SERVICE_NAME: &str = "tru-fit-tauri";
const ACCOUNT_NAME: &str = "user_token";

#[tauri::command]
fn save_token(token: String) -> Result<(), String> {
    let entry = Entry::new(SERVICE_NAME, ACCOUNT_NAME).map_err(|e| e.to_string())?;
    entry.set_password(&token).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_token() -> Result<String, String> {
    let entry = Entry::new(SERVICE_NAME, ACCOUNT_NAME).map_err(|e| e.to_string())?;
    entry.get_password().map_err(|e| e.to_string())
}

#[tauri::command]
async fn generate_text(prompt: String) -> Result<String, String> {
    dotenv().ok();
    let api_key = env::var("OPENAI_API_KEY").map_err(|_| "OPENAI_API_KEY not set".to_string())?;

    tauri::async_runtime::spawn(async move {
        let open_ai = OpenAI::default().with_model("gpt-4o-mini").with_config(
            OpenAIConfig::default().with_api_key(&api_key), //if you want to set you open ai key,
        );

        let response = open_ai.invoke(&prompt).await.unwrap();
        println!("{}", response);
        Ok(response)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            save_token,
            get_token,
            generate_text
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
