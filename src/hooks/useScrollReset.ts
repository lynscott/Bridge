import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCurrentWindow } from "@tauri-apps/api/window";
// import { useScrollRestoration } from 'react-router-dom'

export const useScrollReset = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'smooth' if you want animated scrolling
    });
  }, [pathname]);
};
