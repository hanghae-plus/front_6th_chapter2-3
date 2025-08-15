export function updateURL<T extends Record<string, string | number>>(params: T) {
  if (typeof window === "undefined") return

  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "" && (typeof value !== "number" || value !== 0)) {
      searchParams.set(key, value.toString())
    }
  })

  const newURL = `${window.location.pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`
  window.history.replaceState({}, "", newURL)
}
