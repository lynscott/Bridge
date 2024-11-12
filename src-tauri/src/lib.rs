use anyhow::Result;
mod commands;
use commands::generate_macros;
use keyring::Entry;
use tauri_plugin_record_video;

// tauri::ios_plugin_binding!(init_plugin_video_recorder);

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
async fn verify_token() -> Result<bool, String> {
    match get_token() {
        Ok(token) => Ok(!token.is_empty()),
        Err(_) => Ok(false),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_record_video::init())
        // .plugin(tauri_plugin_video_recorder::init())
        .invoke_handler(tauri::generate_handler![
            save_token,
            get_token,
            generate_macros,
            verify_token
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
