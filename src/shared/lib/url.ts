// URL 파라미터 업데이트
export const updateURLParams = (params: Record<string, string | number | undefined>) => {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      urlParams.set(key, value.toString());
    }
  });

  return urlParams.toString();
};
