type HighlightPart = {
  text: string
  isMatch: boolean
}

/**
 * @param text - 분리할 텍스트
 * @param highlight - 하이라이트할 텍스트
 * @returns 하이라이트 부분과 그렇지 않은 부분으로 분리된 배열
 */
export function highlightText(text: string, highlight: string): HighlightPart[] {
  if (!text) return []
  if (!highlight || !highlight.trim()) return [{ text, isMatch: false }]

  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, i) => ({
    text: part,
    isMatch: i % 2 === 1,
  }))
}
