/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TAWK_PROPERTY_ID?: string;
  readonly VITE_TAWK_WIDGET_ID?: string;
  readonly VITE_TAWK_MOBILE_OFFSET_Y?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  Tawk_API?: {
    toggle?: () => void;
    maximize?: () => void;
    minimize?: () => void;
    showWidget?: () => void;
    hideWidget?: () => void;
    customStyle?: any;
    onLoad?: () => void;
    onBeforeLoad?: () => void;
    [key: string]: any;
  };
  Tawk_LoadStart?: Date;
}

