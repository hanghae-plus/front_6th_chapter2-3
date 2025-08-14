export const getUrlParams = (params: Record<string, string>) => {
  return new URLSearchParams(params).toString();
};

export const getSearchParams = (params: Record<string, string>) => {
  return new URLSearchParams(params).toString();
};
