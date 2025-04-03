/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_GLOBAL_BACKEND_URL: string;
  readonly VITE_PUBLIC_TEZOS_RPC_URL: string;
  readonly VITE_DIRECT_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
