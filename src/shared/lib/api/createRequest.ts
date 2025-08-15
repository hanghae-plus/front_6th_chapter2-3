export const createRequest = (method: string, body?: any) => {
  const request: RequestInit = {
    method: method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) {
    request.body = JSON.stringify(body);
  }

  return request;
};
