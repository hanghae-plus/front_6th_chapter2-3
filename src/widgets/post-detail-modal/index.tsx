import { useAtom, useSetAtom } from "jotai"
import { DialogTitle } from "@radix-ui/react-dialog"

import { Dialog, DialogContent, DialogHeader } from "../../shared/ui"
import HighlightText from "../../shared/ui/HighlightText"
import { CommentsSection } from "../../features/comments-management/ui/CommentSection"
import { ComponentProps } from "react"
import {
  detailPostAtom,
  isPostDetailModalOpenAtom,
} from "../../features/view-post-detail/model/atoms"
import { isAddCommentModalOpenAtom } from "../../features/add-comment/model/atoms"

interface PostDetailModalProps
  extends Omit<ComponentProps<typeof CommentsSection>, "onAddComment" | "postId"> {}

const PostDetailModal = ({
  comments,
  searchQuery,
  onDeleteComment,
  onEditComment,
  onLikeComment,
}: PostDetailModalProps) => {
  const [isOpen, setIsOpen] = useAtom(isPostDetailModalOpenAtom)
  const [post] = useAtom(detailPostAtom)
  const setIsAddCommentModalOpen = useSetAtom(isAddCommentModalOpenAtom)

  const postId = post?.id

  if (!postId) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <HighlightText text={post.title} highlight={searchQuery} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <HighlightText text={post?.body} highlight={searchQuery} />
          </p>
          <CommentsSection
            postId={postId}
            comments={comments}
            searchQuery={searchQuery}
            onAddComment={() => setIsAddCommentModalOpen(true)}
            onClickLike={onLikeComment}
            onClickEdit={onEditComment}
            onClickDelete={onDeleteComment}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostDetailModal
