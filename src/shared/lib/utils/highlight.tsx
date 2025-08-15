import { JSX } from "react"

/** 문자열 찾기 */
const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** 문자열 하이라이트 */
export const highlightText = (text: string, highlight: string): JSX.Element | null => {
  if (!text) return null

  const trimmedHighlight = highlight.trim()
  if (!trimmedHighlight) {
    return <span>{text}</span>
  }

  const regex = new RegExp(`(${escapeRegex(trimmedHighlight)})`, "gi")
  const parts = text.split(regex).filter((part) => part.length > 0)

  return (
    <span>
      {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
    </span>
  )
}
