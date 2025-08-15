interface PostTagItemProps {
  tag: string
  isSelected: boolean
  onClick: () => void
}

export const PostTagItem = ({ tag, isSelected, onClick }: PostTagItemProps) => {
  return (
    <span
      key={tag}
      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
        isSelected ? "text-white bg-blue-500 hover:bg-blue-600" : "text-blue-800 bg-blue-100 hover:bg-blue-200"
      }`}
      onClick={onClick}
    >
      {tag}
    </span>
  )
}
