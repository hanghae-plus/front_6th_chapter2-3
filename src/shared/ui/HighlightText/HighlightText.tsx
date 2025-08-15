import { usePostSearch } from '@/features';

interface HighlightTextProps {
  text: string;
}

export const HighlightText = ({ text }: HighlightTextProps) => {
  const { searchQuery } = usePostSearch();

  if (!text) return null;
  if (!searchQuery.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${searchQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
      )}
    </span>
  );
};
