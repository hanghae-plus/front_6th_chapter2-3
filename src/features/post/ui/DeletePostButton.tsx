import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { Button } from "@/shared/ui"
import { PostWithAuthor } from "@/shared/types"
import { postMutations } from "../model/mutations"

interface DeletePostButtonProps {
  post: PostWithAuthor
}

export const DeletePostButton = ({ post }: DeletePostButtonProps) => {
  const queryClient = useQueryClient()

  const deletePostMutation = useMutation({
    ...postMutations.remove(queryClient, post.id),
  })

  const handleDelete = () => {
    if (window.confirm(`"${post.title}" 게시물을 삭제하시겠습니까?`)) {
      deletePostMutation.mutate(post.id)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={deletePostMutation.isPending}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
