/**
 * 텍스트에서 검색어를 하이라이트 처리하는 함수들
 */

/**
 * 텍스트에서 검색어를 하이라이트 처리하는 함수 (HTML 문자열 반환)
 * @param text - 하이라이트할 원본 텍스트
 * @param highlight - 하이라이트할 검색어
 * @returns 하이라이트가 적용된 HTML 문자열
 */
export const highlightText = (text: string, highlight: string): string => {
  if (!text) return ""

  if (!highlight.trim()) {
    return text
  }

  const regex = new RegExp(`(${highlight})`, "gi")
  const parts = text.split(regex)

  return parts
    .map((part) => {
      // 정규식과 일치하는 부분인지 확인 (대소문자 구분 없이)
      const isMatch = regex.test(part) || part.toLowerCase() === highlight.toLowerCase()
      return isMatch ? `<mark>${part}</mark>` : part
    })
    .join("")
}

/**
 * 텍스트를 검색어에 따라 분할하여 배열로 반환 (React에서 렌더링용)
 * @param text - 하이라이트할 원본 텍스트
 * @param query - 하이라이트할 검색어
 * @returns 텍스트와 하이라이트 정보가 포함된 객체 배열
 */
export const highlightTextParts = (text: string, query: string): Array<{ text: string; isHighlight: boolean }> => {
  if (!query.trim()) return [{ text, isHighlight: false }]

  const regex = new RegExp(`(${query})`, "gi")
  const parts = text.split(regex)

  return parts.map((part) => ({
    text: part,
    isHighlight: regex.test(part),
  }))
}
