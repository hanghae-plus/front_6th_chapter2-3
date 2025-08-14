import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Edit2, Plus, ThumbsUp, Trash2 } from 'lucide-react'
import { useCommentsQuery } from '@features/comment/get-comment'
import { useAddCommentMutation } from '@features/comment/create-comment'
import { useUpdateCommentMutation } from '@features/comment/update-comment'
import { useDeleteCommentMutation } from '@features/comment/delete-comment'
import { useLikeCommentMutation } from '@features/comment/like-comment'
import { usePostQuery } from '@features/post/get-single-post'
import { useCommentQuery } from '@features/comment/get-single-comment'
import { usePostsUI } from '@shared/store/posts-ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/Dialog'
import { Button } from '@shared/ui/Button'
import { Textarea } from '@shared/ui/Textarea'
import { highlightText } from '@shared/lib/highlightText'

const renderHighlighted = (text: string, highlight: string) => {
  const parts = highlightText(text || '', highlight || '')
  if (parts.length === 0) return null

  return <span>{parts.map((p, i) => (p.isMatch ? <mark key={i}>{p.text}</mark> : <span key={i}>{p.text}</span>))}</span>
}

// 댓글 섹션 컴포넌트
const CommentsSection = ({ postId }: { postId: number }) => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get('search') || ''

  const { setSelectedCommentId, setShowAddCommentDialog, setShowEditCommentDialog } = usePostsUI()

  const { data: comments = [], isLoading: isCommentsLoading } = useCommentsQuery(postId)
  const likeCommentMutation = useLikeCommentMutation()
  const deleteCommentMutation = useDeleteCommentMutation()

  if (isCommentsLoading) {
    return <div>댓글 로딩 중...</div>
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{renderHighlighted(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  likeCommentMutation.mutate({
                    id: comment.id,
                    likes: comment.likes,
                    postId,
                  })
                }
              >
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCommentId(comment.id)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteCommentMutation.mutate({ id: comment.id, postId })}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 메인 위젯 컴포넌트
export const CommentManagementWidget = () => {
  const {
    selectedPostId,
    selectedCommentId,
    showAddCommentDialog,
    showEditCommentDialog,
    showPostDetailDialog,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setShowPostDetailDialog,
    setSelectedCommentId,
  } = usePostsUI()

  // ID로 데이터 조회
  const { data: selectedPost, isLoading: isPostLoading } = usePostQuery(selectedPostId!, {
    enabled: !!selectedPostId && showPostDetailDialog,
  })

  const { data: selectedComment, isLoading: isCommentLoading } = useCommentQuery(selectedCommentId!, {
    enabled: !!selectedCommentId && showEditCommentDialog,
  })

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get('search') || ''

  // 새 댓글 상태
  const [newComment, setNewComment] = useState<{
    body: string
    userId: number
  }>({
    body: '',
    userId: 1,
  })

  // 댓글 수정 상태 (로컬 편집용)
  const [editingComment, setEditingComment] = useState<{ body: string }>({
    body: '',
  })

  // 수정 모드에서 데이터 로드 시 편집 상태 초기화
  useEffect(() => {
    if (selectedComment && showEditCommentDialog) {
      setEditingComment({ body: selectedComment.body || '' })
    }
  }, [selectedComment, showEditCommentDialog])

  // 댓글 뮤테이션들
  const addCommentMutation = useAddCommentMutation()
  const updateCommentMutation = useUpdateCommentMutation()

  // 댓글 추가 핸들러
  const handleAddComment = () => {
    if (selectedPostId) {
      addCommentMutation.mutate(
        {
          body: newComment.body,
          postId: selectedPostId,
          userId: newComment.userId,
        },
        {
          onSuccess: () => {
            setShowAddCommentDialog(false)
            setNewComment({ body: '', userId: 1 })
          },
        },
      )
    }
  }

  // 댓글 수정 핸들러
  const handleUpdateComment = () => {
    if (selectedComment) {
      updateCommentMutation.mutate(
        { ...selectedComment, body: editingComment.body },
        {
          onSuccess: () => {
            setShowEditCommentDialog(false)
            setSelectedCommentId(null)
            setEditingComment({ body: '' })
          },
        },
      )
    }
  }

  return (
    <>
      {/* 게시물 상세 보기 대화상자 */}
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {isPostLoading ? '로딩 중...' : renderHighlighted(selectedPost?.title || '', searchQuery)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isPostLoading ? (
              <div>게시물 로딩 중...</div>
            ) : (
              <>
                <p>{renderHighlighted(selectedPost?.body || '', searchQuery)}</p>
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
