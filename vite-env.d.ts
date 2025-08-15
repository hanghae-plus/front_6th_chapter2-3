/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // 필요한 VITE_ 변수들 추가
  // readonly VITE_SOME_FLAG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
