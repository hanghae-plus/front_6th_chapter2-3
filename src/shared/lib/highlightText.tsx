// Wrap matching substrings with <mark>. Falls back to plain text when no highlight.
// Escapes special regex characters in the highlight string.
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function highlightText(text: string | undefined, highlight: string) {
  if (!text) return null;
  if (!highlight.trim()) return <span>{text}</span>;
  const pattern = escapeRegExp(highlight);
  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}
