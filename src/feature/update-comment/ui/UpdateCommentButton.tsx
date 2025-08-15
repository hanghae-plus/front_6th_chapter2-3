import { Edit2 } from "lucide-react"
import { PropsWithChildren } from "react"

import { Comment } from "@/entities/comment"
import { useModal } from "@/shared/hooks/useModal"
import { Button } from "@/shared/ui"

import { UpdateCommentModal } from "./UpdateCommentModal"

interface Props {
  comment: Comment
}

export const UpdateCommentButton = ({ children, comment }: PropsWithChildren<Props>) => {
  const updateCommentModal = useModal<Comment>(`update-comment-${comment.id}`)

  const handleUpdateComment = () => {
    updateCommentModal.open(comment)
  }

  return (
    <>
      <Button onClick={handleUpdateComment} size="sm" variant="ghost">
        <Edit2 className="w-4 h-4 mr-2" />
        {children || "댓글 수정"}
      </Button>
      <UpdateCommentModal modalId={`update-comment-${comment.id}`} />
    </>
  )
}
