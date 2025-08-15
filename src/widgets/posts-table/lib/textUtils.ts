export const highlightText = (text: string, highlight: string) => {
  if (!text) return null
  if (!highlight.trim()) {
    return { __html: text }
  }
  const regex = new RegExp(`(${highlight})`, 'gi')
  const parts = text.split(regex)
  
  return parts.map((part, i) => ({
    text: part,
    isHighlighted: regex.test(part),
    key: i
  }))
}