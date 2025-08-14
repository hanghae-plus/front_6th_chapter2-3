export const requestApi = async <T>(
  url: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
    body?: any
  },
): Promise<{
  result: boolean
  data?: T
  error?: string
}> => {
  try {
    const config: RequestInit = {
      method: options?.method || "GET",
      headers: { "Content-Type": "application/json" },
    }

    if (options?.method !== "GET" && options?.body) {
      config.body = JSON.stringify(options.body)
    }

    const res = await fetch(url, config)

    if (!res.ok) {
      return { result: false, error: `HTTP ${res.status}` }
    }

    return { result: true, data: await res.json() }
  } catch (error) {
    return { result: false, error: (error as Error).message }
  }
}
