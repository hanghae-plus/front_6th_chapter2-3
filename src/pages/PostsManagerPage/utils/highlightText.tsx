export const highlightText = (text: string, query: string) => {
  if (!text || !query?.trim()) return <span>{text}</span>
  const regex = new RegExp(`(${query})`, "gi")
  return (
    <span>
      {text
        .split(regex)
        .map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
    </span>
  )
}
