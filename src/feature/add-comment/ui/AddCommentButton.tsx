import { Plus } from "lucide-react"
import { PropsWithChildren } from "react"

import { useModal } from "@/shared/hooks/useModal"
import { Button } from "@/shared/ui"

import { AddCommentModal } from "./AddCommentModal"

interface Props {
  postId: number
}

export const AddCommentButton = ({ children, postId }: PropsWithChildren<Props>) => {
  const addCommentModal = useModal<{ postId: number }>(`add-comment-${postId}`)

  const handleAddComment = () => {
    addCommentModal.open({ postId })
  }

  return (
    <>
      <Button onClick={handleAddComment} size="sm">
        <Plus className="w-3 h-3 mr-1" />
        {children || "댓글 추가"}
      </Button>
      <AddCommentModal modalId={`add-comment-${postId}`} />
    </>
  )
}
