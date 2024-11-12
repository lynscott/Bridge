import { invoke } from '@tauri-apps/api/core'

export async function ping(value: string): Promise<string | null> {
  return await invoke<{value?: string}>('plugin:record-video|ping', {
    payload: {
      value,
    },
  }).then((r) => (r.value ? r.value : null));
}


export async function startRecording(): Promise<string> {
  return await invoke<{message: string}>('plugin:record-video|startRecording')
    .then((r) => r.message);
}

export async function stopRecording(): Promise<string> {
  return await invoke<{message: string}>('plugin:record-video|stopRecording')
    .then((r) => r.message);
}