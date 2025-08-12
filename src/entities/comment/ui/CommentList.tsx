import { Button } from "../../../shared/ui/Button"
import { Plus } from "lucide-react"
import { useCommentStore } from "../model/store"
import { CommentItem } from "./CommentItem"
import { useCommentManagement } from "../../../features/commentManagement/model/useCommentManagement"

interface CommentListProps {
  postId: number
  searchQuery?: string
}

const CommentList: FC<CommentListProps> = ({ postId, searchQuery = "" }) => {
  const { comments } = useCommentStore()
  const { openAddCommentDialog } = useCommentManagement()

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => openAddCommentDialog(postId)}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} searchQuery={searchQuery} />
        ))}
      </div>
    </div>
  )
}

export default CommentList
