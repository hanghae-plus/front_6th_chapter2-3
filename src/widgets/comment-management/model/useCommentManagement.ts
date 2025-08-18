import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useCommentsQuery } from '@features/comment/get-comment'
import { useAddCommentMutation } from '@features/comment/create-comment'
import { useUpdateCommentMutation } from '@features/comment/update-comment'
import { useDeleteCommentMutation } from '@features/comment/delete-comment'
import { useLikeCommentMutation } from '@features/comment/like-comment'
import { usePostQuery } from '@features/post/get-single-post'
import { useCommentQuery } from '@features/comment/get-single-comment'
import { usePostsUI } from '@shared/store/posts-ui'

export const useCommentManagement = () => {
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

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get('search') || ''

  // ID로 데이터 조회
  const { data: selectedPost, isLoading: isPostLoading } = usePostQuery(selectedPostId!, {
    enabled: !!selectedPostId && showPostDetailDialog,
  })

  const { data: selectedComment, isLoading: isCommentLoading } = useCommentQuery(selectedCommentId!, {
    enabled: !!selectedCommentId && showEditCommentDialog,
  })

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

  return {
    // State
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
    
    // Actions
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setShowPostDetailDialog,
    setSelectedCommentId,
    
    // Mutations
    addCommentMutation,
    updateCommentMutation,
    
    // Handlers
    handleAddComment,
    handleUpdateComment,
  }
}

export const useCommentsSection = (postId: number) => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get('search') || ''

  const { setSelectedCommentId, setShowAddCommentDialog, setShowEditCommentDialog } = usePostsUI()

  const { data: comments = [], isLoading: isCommentsLoading } = useCommentsQuery(postId)
  const likeCommentMutation = useLikeCommentMutation()
  const deleteCommentMutation = useDeleteCommentMutation()

  return {
    comments,
    isCommentsLoading,
    searchQuery,
    setSelectedCommentId,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    likeCommentMutation,
    deleteCommentMutation,
  }
}