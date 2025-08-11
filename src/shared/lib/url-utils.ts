// URL 파라미터 업데이트 유틸리티
export const createURLParams = (params: Record<string, string | number | undefined>): string => {
  const urlParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      urlParams.set(key, value.toString())
    }
  })
  
  return urlParams.toString()
}

// URL에서 파라미터 추출
export const parseURLParams = (search: string) => {
  const params = new URLSearchParams(search)
  return {
    skip: parseInt(params.get("skip") || "0"),
    limit: parseInt(params.get("limit") || "10"),
    search: params.get("search") || "",
    sortBy: params.get("sortBy") || "",
    sortOrder: params.get("sortOrder") || "asc",
    tag: params.get("tag") || ""
  }
}