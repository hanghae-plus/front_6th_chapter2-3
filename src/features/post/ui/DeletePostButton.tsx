import { Trash2 } from "lucide-react"
import { Button } from "@/shared/ui"
import { useDeletePost } from "../model/mutations"

interface DeletePostButtonProps {
  postId: number
}

export const DeletePostButton = ({ postId }: DeletePostButtonProps) => {
  const { mutate: deletePost, isPending } = useDeletePost()

  return (
    <Button variant="ghost" size="sm" onClick={() => deletePost(postId)} disabled={isPending}>
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
