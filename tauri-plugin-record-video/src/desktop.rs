use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;

pub fn init<R: Runtime, C: DeserializeOwned>(
    app: &AppHandle<R>,
    _api: PluginApi<R, C>,
) -> crate::Result<RecordVideo<R>> {
    Ok(RecordVideo(app.clone()))
}

/// Access to the record-video APIs.
pub struct RecordVideo<R: Runtime>(AppHandle<R>);

impl<R: Runtime> RecordVideo<R> {
    pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
        Ok(PingResponse {
            value: payload.value,
        })
    }

    pub fn stop_recording(&self) -> crate::Result<()> {
        println!("test");
        Ok(())
    }

    pub fn start_recording(&self) -> crate::Result<()> {
        println!("test");
        Ok(())
    }
}
