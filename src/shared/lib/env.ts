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

// API 베이스 URL 설정 - 프로덕션에서는 직접 dummyjson.com 호출
// GitHub Pages 배포 시 항상 dummyjson.com 사용
export const API_BASE_URL =
  viteEnv.VITE_API_BASE_URL ||
  (viteEnv.MODE === "production" || viteEnv.PROD === "true" || viteEnv.NODE_ENV === "production"
    ? "https://dummyjson.com"
    : "/api")
