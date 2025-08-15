import { FetcherResponse } from "@/shared/api/response"

interface FetcherOptions extends Omit<RequestInit, "body" | "method"> {
  body?: object
  searchParams?: Record<string, string | number | boolean | undefined>
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
}

const prefixUrl = import.meta.env.PROD ? "https://dummyjson.com" : "/api"

function createFetcherUrl(url: string, options: FetcherOptions = {}) {
  const { searchParams } = options

  if (prefixUrl) {
    url = `${prefixUrl}${url}`
  }

  if (searchParams) {
    const isAbsoluteUrl = url.startsWith("http://") || url.startsWith("https://")
    const baseUrl = isAbsoluteUrl ? url : `${window.location.origin}${url}`
    const urlObj = new URL(baseUrl)

    // undefined, null, empty string 값 필터링
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        urlObj.searchParams.set(key, String(value))
      }
    })

    if (isAbsoluteUrl) {
      url = urlObj.toString()
    } else {
      url = urlObj.pathname + urlObj.search
    }
  }

  return url
}

export async function fetcher(url: string, options: FetcherOptions = {}) {
  const { body, searchParams, method = "GET", ...fetchOptions } = options
  const fetcherUrl = createFetcherUrl(url, { searchParams })

  const requestOptions: RequestInit = {
    ...fetchOptions,
    method,
  }

  if (body !== undefined) {
    requestOptions.body = JSON.stringify(body)
    requestOptions.headers = {
      "Content-Type": "application/json",
      ...requestOptions.headers,
    }
  }

  const response = await fetch(fetcherUrl, requestOptions)

  return new FetcherResponse(response)
}

fetcher.get = (url: string, options?: FetcherOptions) => fetcher(url, { ...options, method: "GET" })
fetcher.post = (url: string, options?: FetcherOptions) => fetcher(url, { ...options, method: "POST" })
fetcher.put = (url: string, options?: FetcherOptions) => fetcher(url, { ...options, method: "PUT" })
fetcher.patch = (url: string, options?: FetcherOptions) => fetcher(url, { ...options, method: "PATCH" })
fetcher.delete = (url: string, options?: FetcherOptions) => fetcher(url, { ...options, method: "DELETE" })
