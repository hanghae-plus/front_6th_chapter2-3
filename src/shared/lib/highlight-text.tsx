import React from "react"

/**
 * 텍스트에서 특정 문자열을 찾아 하이라이트(mark 태그) 처리합니다.
 * @param text - 하이라이트할 원본 텍스트
 * @param highlight - 하이라이트할 문자열
 * @returns React.ReactNode - 하이라이트된 텍스트 노드
 */
export const highlightText = (text: string, highlight: string): React.ReactNode => {
  // 텍스트가 없거나 하이라이트할 문자열이 비어있으면 원본 텍스트를 그대로 반환합니다.
  if (!text || !highlight.trim()) {
    return <span>{text}</span>
  }

  // 대소문자를 구분하지 않고 검색하기 위해 정규식을 생성합니다.
  const regex = new RegExp(`(${highlight})`, "gi")
  // 정규식의 캡처 그룹을 사용하여 텍스트를 나눕니다.
  // 예: "Hello World"를 "o"로 나누면 ["Hell", "o", " W", "o", "rld"]가 됩니다.
  const parts = text.split(regex)

  // 나눠진 부분을 순회하며 하이라이트 처리합니다.
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          // 정규식에 일치하는 부분은 <mark> 태그로 감싸 하이라이트합니다.
          <mark key={i}>{part}</mark>
        ) : (
          // 일치하지 않는 부분은 일반 <span> 태그로 렌더링합니다.
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}
