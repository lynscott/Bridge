use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri::Runtime;

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PingRequest {
    pub value: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PingResponse {
    pub value: Option<String>,
}

pub struct RecordVideo<R: Runtime> {
    pub app: AppHandle<R>,
}
