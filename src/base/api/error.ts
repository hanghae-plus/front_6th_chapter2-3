export class HTTPError extends Error {
  response: Response

  constructor(response: Response) {
    super(`HTTP Error ${response.status}: ${response.statusText}`)
    this.name = "HTTPError"
    this.response = response
  }
}
