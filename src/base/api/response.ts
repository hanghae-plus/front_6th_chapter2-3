import { HTTPError } from "@/base/api/error"

export class FetcherResponse {
  constructor(private response: Response) {}

  get ok() {
    return this.response.ok
  }

  get status() {
    return this.response.status
  }

  get statusText() {
    return this.response.statusText
  }

  get headers() {
    return this.response.headers
  }

  public async json<T = unknown>(): Promise<T> {
    if (!this.response.ok) {
      throw new HTTPError(this.response)
    }

    return this.response.json()
  }
}
