import { PostItem } from "../../../../entities/post/model"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../shared/ui"
import { HighlightText } from "../../../../shared/ui/HighlightText"
import { CommentSection } from "../../../../widgets/comment-section/ui/CommentSection"
import { Comment } from "../../../../entities/comment/model"

interface DetailPostModalProps {
  state: {
    isOpen: boolean
    selectedPost: PostItem
    searchMode: {
      param: string
    }
    comments?: Comment[]
  }
  actions: {
    onOpenChange: (open: boolean) => void
    onAddComment: (postId: number) => void
    onLikeComment: (params: { id: number; postId: number }) => void
    onUpdateComment: (comment: Comment) => void
    onDeleteComment: (params: { id: number; postId: number }) => void
  }
}

export default function DetailPostModal({ state, actions }: DetailPostModalProps) {
  const { isOpen, selectedPost, searchMode } = state
  const { onAddComment, onLikeComment, onUpdateComment, onDeleteComment } = actions

  return (
    <Dialog open={isOpen} onOpenChange={actions.onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <HighlightText text={selectedPost?.title || ""} highlight={searchMode.param} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <HighlightText text={selectedPost?.body || ""} highlight={searchMode.param} />
          </p>
          <CommentSection
            postId={selectedPost?.id || 0}
            comments={state.comments}
            searchQuery={searchMode.param}
            onAddComment={onAddComment}
            onLikeComment={onLikeComment}
            onUpdateComment={onUpdateComment}
            onDeleteComment={onDeleteComment}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
