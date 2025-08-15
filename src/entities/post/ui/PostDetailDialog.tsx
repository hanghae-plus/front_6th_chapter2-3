import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Dialog"
import { highlightText } from "../../../shared/utils/highlightText"
import { Post } from "../model/types"
import CommentList from "../../comment/ui/CommentList"
import { useComments } from "../../comment/model/queries"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPost: Post | null
  searchQuery: string
  onAddComment: (postId: number) => void
  onEditComment: (comment: any) => void
  onDeleteComment: (id: number, postId: number) => void
  onLikeComment: (id: number, postId: number) => void
}

const PostDetailDialog = ({
  open,
  onOpenChange,
  selectedPost,
  searchQuery,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: PostDetailDialogProps) => {
  // TanStack Query로 댓글 가져오기
  const { data: commentsData, isLoading: commentsLoading } = useComments(selectedPost?.id || 0)
  const comments = commentsData?.comments || []
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
          {selectedPost && (
            <>
              {commentsLoading ? (
                <div className="text-center py-4">댓글 로딩 중...</div>
              ) : (
                <CommentList
                  postId={selectedPost.id}
                  searchQuery={searchQuery}
                  comments={comments}
                  onAddComment={onAddComment}
                  onEditComment={onEditComment}
                  onDeleteComment={(commentId) => onDeleteComment(commentId, selectedPost.id)}
                  onLikeComment={(commentId) => onLikeComment(commentId, selectedPost.id)}
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostDetailDialog
