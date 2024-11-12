use serde::de::DeserializeOwned;
use tauri::{
    plugin::{PluginApi, PluginHandle},
    AppHandle, Runtime,
};

use crate::models::*;

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_record_video);

// initializes the Kotlin or Swift plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
    _app: &AppHandle<R>,
    api: PluginApi<R, C>,
) -> crate::Result<RecordVideo<R>> {
    #[cfg(target_os = "android")]
    let handle = api.register_android_plugin("", "ExamplePlugin")?;
    #[cfg(target_os = "ios")]
    let handle = api.register_ios_plugin(init_plugin_record_video)?;
    Ok(RecordVideo(handle))
}

/// Access to the record-video APIs.
pub struct RecordVideo<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> RecordVideo<R> {
    pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
        self.0
            .run_mobile_plugin("ping", payload)
            .map_err(Into::into)
    }
    pub fn start_recording(&self) -> crate::Result<String> {
        self.0
            .run_mobile_plugin("startRecording")
            .map_err(Into::into)
    }
    pub fn stop_recording(&self) -> crate::Result<String> {
        self.0
            .run_mobile_plugin("stopRecording")
            .map_err(Into::into)
    }
}
