import { highlightText } from '@shared/lib/highlightText'

export const renderHighlighted = (text: string, highlight: string) => {
  const parts = highlightText(text || '', highlight || '')
  if (parts.length === 0) return null

  return parts.map((p, i) => (p.isMatch ? { text: p.text, isHighlighted: true, key: i } : { text: p.text, isHighlighted: false, key: i }))
}