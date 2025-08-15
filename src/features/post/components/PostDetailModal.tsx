import { useLikeComment } from "@entities/comment/hooks/mutations/useLikeComment"
import { useGetComment } from "@entities/comment/hooks/queries/useGetComment"
import { usePostDetailStore } from "@entities/post/stores/usePostDetailStore"

import { AddCommentButton } from "@features/comment/components/AddCommentButton"
import { DeleteCommentButton } from "@features/comment/components/DeleteCommentButton"
import { EditCommentButton } from "@features/comment/components/EditCommentButton"
import { highlightText } from "@pages/PostsManagerPage/utils/highlightText"
import { Button } from "@shared/components/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/components/dialog"
import { ThumbsUp } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { useShallow } from "zustand/shallow"

export const PostDetailModal = () => {
  const [searchParams] = useSearchParams()
  const { selectedPost, isOpenPostDetail, setIsOpenPostDetail } = usePostDetailStore(
    useShallow((state) => ({
      selectedPost: state.selectedPost,
      isOpenPostDetail: state.isOpenPostDetail,
      setIsOpenPostDetail: state.actions.setIsOpenPostDetail,
    })),
  )

  const searchQuery = searchParams.get("search") || ""
  const { data: commentsData } = useGetComment(selectedPost?.id || 1, {
    enabled: !!selectedPost?.id,
  })

  const { mutate: likeCommentMutation } = useLikeComment(selectedPost?.id || 1)

  const comments = commentsData?.comments || []

  const handleLikeComment = (commentId: number) => {
    likeCommentMutation(commentId)
  }

  return (
    <Dialog open={isOpenPostDetail} onOpenChange={setIsOpenPostDetail}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
          {/* 댓글 섹션 */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">댓글</h3>
              <AddCommentButton postId={selectedPost?.id || 1} />
            </div>
            <div className="space-y-1">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <span className="font-medium truncate">{comment.user.username}:</span>
                    <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleLikeComment(comment.id)}>
                      <ThumbsUp className="w-3 h-3" />
                      <span className="ml-1 text-xs">{comment.likes}</span>
                    </Button>
                    <EditCommentButton comment={comment} />
                    <DeleteCommentButton comment={comment} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
