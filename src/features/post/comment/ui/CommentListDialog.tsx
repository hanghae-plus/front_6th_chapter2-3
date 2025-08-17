import { highlightText } from "../../../shared/lib/highlight-text"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../widgets/ui"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { useComment } from "../../../features/post/comment/hooks/useComment"

// 게시물 테이블 렌더링
export const CommentListDialog = (props) => {
  const {
    comments,
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    deleteComment,
    likeComment,
  } = useComment()

  const { showPostDetailDialog, setShowPostDetailDialog, selectedPost, searchQuery } = props

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body, searchQuery)}</p>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">댓글</h3>
              <Button
                size="sm"
                onClick={() => {
                  setNewComment((prev) => ({ ...prev, postId: selectedPost.id }))
                  setShowAddCommentDialog(true)
                }}
              >
                <Plus className="w-3 h-3 mr-1" />
                댓글 추가
              </Button>
            </div>
            <div className="space-y-1">
              {comments[selectedPost?.id]?.map((comment) => (
                <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
                  <div className="flex items-center space-x-2 overflow-hidden">
                    <span className="font-medium truncate">{comment.user.username}:</span>
                    <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, selectedPost.id)}>
                      <ThumbsUp className="w-3 h-3" />
                      <span className="ml-1 text-xs">{comment.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedComment(comment)
                        setShowEditCommentDialog(true)
                      }}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id, selectedPost.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
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
