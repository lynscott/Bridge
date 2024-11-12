use tauri::{command, AppHandle, Runtime};

use crate::models::RecordVideo;
use crate::models::*;
use crate::RecordVideoExt;
use crate::Result;

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
pub fn stop_recording<R: Runtime>(app: AppHandle<R>) {
    app.record_video().stop_recording();
}
