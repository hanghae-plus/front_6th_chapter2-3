import { Trash2 } from "lucide-react"
import { useDeletePost } from "@/features/post/delete-post/model/useDeletePost"
import { PostWithAuthor } from "@/entities/post/model/types"
import { Button } from "@/shared/ui"

interface DeletePostButtonProps {
  post: PostWithAuthor
}

export const DeletePostButton = ({ post }: DeletePostButtonProps) => {
  const { deletePost, isPending } = useDeletePost()

  const handleDelete = () => {
    if (window.confirm(`"${post.title}" 게시물을 삭제하시겠습니까?`)) {
      deletePost(post.id)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
