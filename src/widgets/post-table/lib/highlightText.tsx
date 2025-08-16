export const highlightText = (text: string, highlight: string) => {
  if (!text) return null
  if (!highlight.trim()) {
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
