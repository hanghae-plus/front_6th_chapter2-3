export const highlightText = (text: string, query: string) => {
  if (!text) return null;
  if (!query.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => {
        // 대소문자 구분 없이 검색어와 일치하는지 확인
        const isMatch = query.toLowerCase() === part.toLowerCase();
        return isMatch ? (
          <mark key={i} className="bg-yellow-200 px-1 rounded">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
};
