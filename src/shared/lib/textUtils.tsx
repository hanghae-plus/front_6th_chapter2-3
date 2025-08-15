export const highlightText = (text: string, highlight: string) => {
  if (!highlight.trim()) {
    return text;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className='bg-yellow-200 font-semibold'>
        {part}
      </span>
    ) : (
      part
    )
  );
};
