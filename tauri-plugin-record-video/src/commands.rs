use tauri::{AppHandle, command, Runtime};

use crate::models::*;
use crate::Result;
use crate::RecordVideoExt;

#[command]
pub(crate) async fn ping<R: Runtime>(
    app: AppHandle<R>,
    payload: PingRequest,
) -> Result<PingResponse> {
    app.record_video().ping(payload)
}

#[command]
pub(crate) async fn start_recording<R: Runtime>(app: AppHandle<R>) {
    app.record_video().start_recording();
}

#[command]
pub(crate) async fn stop_recording<R: Runtime>(app: AppHandle<R>) {
    let _ =app.record_video().stop_recording();
}