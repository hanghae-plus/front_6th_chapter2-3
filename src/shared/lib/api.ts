// Unified JSON fetch helper
export interface ApiJsonOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export async function apiJson<T = any>(url: string, options: ApiJsonOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}
