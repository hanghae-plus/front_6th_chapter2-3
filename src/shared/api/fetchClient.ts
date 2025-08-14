const BASE_URL = "/api"

type FetchOptions = RequestInit

async function fetchClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      // You can create a custom error class here
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Handle cases with no content
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return undefined as T
    }

    return await response.json()
  } catch (error) {
    console.error("fetchClient error:", error)
    // Re-throw the error so that the calling code can handle it
    throw error
  }
}

export default fetchClient
