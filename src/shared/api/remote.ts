type Options = Omit<RequestInit, 'body'> & {
  data?: unknown;
  params?: Record<string, string | number>;
};

export const remote = async (url: string, options: Options = {}) => {
  const { data = null, params = {}, ...rest } = options;
  const fetchURL = new URL(url.replace('/api', ''), 'https://dummyjson.com');

  Object.entries(params).forEach(([key, value]) => {
    fetchURL.searchParams.set(key, String(value));
  });

  const response = await fetch(fetchURL, {
    ...rest,
    body: data ? JSON.stringify(data) : undefined,
  });

  return response.json();
};
