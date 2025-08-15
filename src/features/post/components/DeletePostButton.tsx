import { useDeletePost } from "@entities/post/hooks/mutations/useDeletePost"
import { Button } from "@shared/components/button"
import { Trash2 } from "lucide-react"

interface DeletePostButtonProps {
  postId: number
}

export const DeletePostButton = ({ postId }: DeletePostButtonProps) => {
  const { mutate: deletePost } = useDeletePost()

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => deletePost(postId)}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </>
  )
}
