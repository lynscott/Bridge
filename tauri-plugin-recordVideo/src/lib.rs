use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;
// #[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

// #[cfg(desktop)]
// use desktop::RecordVideo;
#[cfg(mobile)]
use mobile::RecordVideo;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the record-video APIs.
pub trait RecordVideoExt<R: Runtime> {
    fn record_video(&self) -> &RecordVideo<R>;
}

impl<R: Runtime, T: Manager<R>> crate::RecordVideoExt<R> for T {
    fn record_video(&self) -> &RecordVideo<R> {
        self.state::<RecordVideo<R>>().inner()
    }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("record-video")
        .invoke_handler(tauri::generate_handler![
            commands::ping,
            commands::start_recording,
            commands::stop_recording
        ])
        .setup(|app, api| {
            // #[cfg(mobile)]
            let record_video = mobile::init(app, api)?;
            // #[cfg(desktop)]
            // let record_video = desktop::init(app, api)?;
            app.manage(record_video);
            Ok(())
        })
        .build()
}
