// vite 환경에서 import.meta.env 접근을 안전하게 수행하기 위한 헬퍼
type EnvRecord = Record<string, string | undefined>

const getViteEnv = (): EnvRecord => {
  try {
    const meta = import.meta as { env?: EnvRecord }
    return meta.env ?? {}
  } catch {
    return {}
  }
}

const viteEnv = getViteEnv()
export const ENV_USE_SERVER_TRUTH = String(viteEnv.VITE_USE_SERVER_TRUTH || "false") === "true"

// API 베이스 URL 설정 - GitHub Pages에서는 항상 dummyjson.com 사용
export const API_BASE_URL = viteEnv.VITE_API_BASE_URL || "https://dummyjson.com"
