import { useQuery } from "@tanstack/react-query"

export function createQueryFn<T>(queryKey: unknown[]) {
  const [basePath, ...rest] = queryKey
  const stringParts = rest.filter((item): item is string => typeof item === "string")
  const params = rest.find((item) => item && typeof item === "object" && !Array.isArray(item))
  const path = [basePath, ...stringParts].join("/")

  return async () => {
    const url = new URL(path, window.location.origin)
    if (params) {
      Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json() as T
  }
}

export function useQuery2<T>(queryKey: unknown[], options = {}) {
  return useQuery<T>({
    queryKey,
    queryFn: createQueryFn<T>(queryKey),
    ...options,
  })
}
