/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API base URL (empty in dev = use proxy) */
  readonly VITE_API_URL?: string;
  /** Public holidays base URL (Nager.Date API v3) */
  readonly VITE_NAGER_DATE_API_URL?: string;
  readonly VITE_DEV_PORT?: string;
  readonly VITE_API_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
