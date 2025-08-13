// PostsManagerPage.tsx에서 그대로 복사한 함수들

// 하이라이트 함수 추가
export const highlightText = (text: string, highlight: string) => {
  if (!text) return null;
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
      )}
    </span>
  );
};
