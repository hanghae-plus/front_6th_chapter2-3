// features/post/ui/PostAuthorCell.tsx
interface PostAuthorCellProps {
  author: { image?: string; username?: string }
  onClick: () => void
}

export const PostAuthorCell = ({ author, onClick }: PostAuthorCellProps) => (
  <div className='flex items-center space-x-2 cursor-pointer' onClick={onClick}>
    <img
      src={author?.image}
      alt={author?.username}
      className='w-8 h-8 rounded-full'
    />
    <span>{author?.username}</span>
  </div>
)
