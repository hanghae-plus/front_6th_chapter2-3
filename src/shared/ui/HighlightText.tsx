// components/HighlightText.tsx
import React from "react"
import { splitHighlightParts } from "../utils/splitHighlightParts"

interface HighlightTextProps {
  /** 원본 텍스트 */
  text: string
  /** 하이라이트할 검색어 */
  highlight: string
}

/**
 * 주어진 텍스트 내에서 특정 검색어를 <mark> 태그로 감싸서 표시하는 컴포넌트
 */
export const HighlightText: React.FC<HighlightTextProps> = ({ text, highlight }) => {
  const parts = splitHighlightParts(text, highlight)

  return (
    <span>{parts.map((p, i) => (p.highlight ? <mark key={i}>{p.text}</mark> : <span key={i}>{p.text}</span>))}</span>
  )
}
