import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/Dialog'
import { Button } from '@shared/ui/Button'
import { Textarea } from '@shared/ui/Textarea'
import { useCommentManagement } from '../model/useCommentManagement'
import { renderHighlighted } from '../lib/textHighlight'
import { CommentsSection } from './CommentsSection'

export const CommentManagementWidget = () => {
  const {
    selectedPostId,
    selectedPost,
    isPostLoading,
    selectedComment,
    isCommentLoading,
    searchQuery,
    newComment,
    setNewComment,
    editingComment,
    setEditingComment,
    showAddCommentDialog,
    showEditCommentDialog,
    showPostDetailDialog,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setShowPostDetailDialog,
    addCommentMutation,
    updateCommentMutation,
    handleAddComment,
    handleUpdateComment,
  } = useCommentManagement()

  return (
    <>
      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {isPostLoading ? '로딩 중...' : (
                <span>
                  {renderHighlighted(selectedPost?.title || '', searchQuery)?.map((part) => 
                    part.isHighlighted ? (
                      <mark key={part.key}>{part.text}</mark>
                    ) : (
                      <span key={part.key}>{part.text}</span>
                    )
                  )}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isPostLoading ? (
              <div>게시물 로딩 중...</div>
            ) : (
              <>
                <p>
                  {renderHighlighted(selectedPost?.body || '', searchQuery)?.map((part) => 
                    part.isHighlighted ? (
                      <mark key={part.key}>{part.text}</mark>
                    ) : (
                      <span key={part.key}>{part.text}</span>
                    )
                  )}
                </p>
                {selectedPostId && <CommentsSection postId={selectedPostId} />}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={newComment.body}
              onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
            />
            <Button onClick={handleAddComment} disabled={addCommentMutation.isPending}>
              {addCommentMutation.isPending ? '추가 중...' : '댓글 추가'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isCommentLoading ? (
              <div>댓글 로딩 중...</div>
            ) : (
              <>
                <Textarea
                  placeholder="댓글 내용"
                  value={editingComment.body}
                  onChange={(e) => setEditingComment({ body: e.target.value })}
                />
                <Button onClick={handleUpdateComment} disabled={updateCommentMutation.isPending || !selectedComment}>
                  {updateCommentMutation.isPending ? '수정 중...' : '댓글 업데이트'}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}