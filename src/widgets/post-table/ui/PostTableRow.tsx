import { ThumbsDown, ThumbsUp } from "lucide-react"
import { DetailPostDialogOpenButton } from "@/features/post/read-post/ui"
import { DeletePostButton } from "@/features/post/delete-post/ui"
import { EditPostDialogOpenButton } from "@/features/post/update-post/ui"
import { useSelectedUserStore } from "@/features/user/view-user-info/model"
import { PostWithAuthor } from "@/entities/post/model/types"
import { TableCell, TableRow } from "@/shared/ui"
import { useDialogActions } from "@/shared/model"

interface PostTableRowProps {
  post: PostWithAuthor
  searchQuery: string
  selectedTag: string
  onTagSelect: (tag: string) => void
  onPostSelect: (postId: number) => void
}

const highlightText = (text: string, highlight: string) => {
  if (!text) return null
  if (!highlight.trim()) {
    return <span>{text}</span>
  }

  const parts = text.split(new RegExp(`(${highlight})`, "gi"))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
      )}
    </span>
  )
}

export const PostTableRow = ({ post, searchQuery, selectedTag, onTagSelect, onPostSelect }: PostTableRowProps) => {
  const { setSelectedUserId } = useSelectedUserStore()
  const { showDialog } = useDialogActions()

  const handleUserInfoClick = () => {
    setSelectedUserId(post.author.id)
    showDialog("USER_INFO")
  }

  return (
    <TableRow>
      <TableCell>{post.id}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <div>{highlightText(post.title, searchQuery)}</div>
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                  selectedTag === tag
                    ? "text-white bg-blue-500 hover:bg-blue-600"
                    : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                }`}
                onClick={() => onTagSelect(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <img src={post.author.image} alt={post.author.username} className="w-8 h-8 rounded-full" />
          <span onClick={handleUserInfoClick} className="cursor-pointer">
            {post.author.username}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4" />
          <span>{post.reactions.likes || 0}</span>
          <ThumbsDown className="w-4 h-4" />
          <span>{post.reactions.dislikes || 0}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <DetailPostDialogOpenButton onClick={() => onPostSelect(post.id)} />
          <EditPostDialogOpenButton onClick={() => onPostSelect(post.id)} />
          <DeletePostButton post={post} />
        </div>
      </TableCell>
    </TableRow>
  )
}
