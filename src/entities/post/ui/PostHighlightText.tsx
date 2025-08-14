type PostHighlightTextProps = {
  text: string
  highlight: string
}

export function PostHighlightText({ text, highlight }: PostHighlightTextProps) {
  if (!text || !highlight.trim()) {
    return <span>{text}</span>
  }

  const parts = text.split(new RegExp(`(${highlight})`, "gi"))

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
      )}
    </span>
  )
}
