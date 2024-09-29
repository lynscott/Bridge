// src/utils/storage.ts
import { invoke } from '@tauri-apps/api/core';

export const saveTokenToSecureStorage = async (token: string) => {
  try {
    invoke('save_token', { token });
    console.log('Token saved successfully');
  } catch (error) {
    console.error('Failed to save token:', error);
    throw error;
  }
};

export const getTokenFromSecureStorage = async () => {
  // Retrieve the token securely
  const token = invoke<string>('get_token');
  return token;
};
