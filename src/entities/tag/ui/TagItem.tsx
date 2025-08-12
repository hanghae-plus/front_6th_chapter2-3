interface TagItemProps {
  // 태그 문자열
  tag: string;
  // 게시물 필터 태그
  selectedTag: string;
  // 태그 클릭 함수
  onClickTag: (value: string) => void;
}

const TagItem = ({ tag, selectedTag, onClickTag }: TagItemProps) => {
  return (
    <span
      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
        selectedTag === tag
          ? 'text-white bg-blue-500 hover:bg-blue-600'
          : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
      }`}
      onClick={() => onClickTag(tag)}
    >
      {tag}
    </span>
  );
};

export default TagItem;
