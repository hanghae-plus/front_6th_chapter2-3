export interface HighlightPart {
  text: string
  highlight: boolean
}

/**
 * 주어진 문자열에서 특정 검색어를 하이라이트할 부분과 그렇지 않은 부분으로 분리합니다.
 * @param text - 분리할 문자열
 * @param highlight - 하이라이트할 검색어
 * @returns 분리된 문자열과 하이라이트 여부를 포함한 배열
 * @example
 * splitHighlightParts("Hello world", "world") // [{ text: "Hello ", highlight: false }, { text: "world", highlight: true }]
 */

export const splitHighlightParts = (text: string, highlight: string): HighlightPart[] => {
  if (!text) return []
  if (!highlight.trim()) return [{ text, highlight: false }]

  const regex = new RegExp(`(${highlight})`, "gi")
  return text.split(regex).map((part) => ({
    text: part,
    highlight: regex.test(part),
  }))
}
