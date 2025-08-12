import React from "react"

type HighlightTextProps = {
  text: string
  highlight: string
}

export const HighlightText: React.FC<HighlightTextProps> = ({ text, highlight }) => {
  if (!text) return null
  if (!highlight.trim()) {
    return <span>{text}</span>
  }
  const regex = new RegExp(`(${highlight})`, "gi")
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? <mark key={index}>{part}</mark> : <span key={index}>{part}</span>,
      )}
    </span>
  )
}


