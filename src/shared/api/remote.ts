export const remote = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, options);
  return response.json();
};
