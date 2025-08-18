import { useState, useEffect } from 'react'
import { useAddPostMutation } from '@features/post/create-post'
import { useUpdatePostMutation } from '@features/post/update-post'
import { usePostQuery } from '@features/post/get-single-post'
import { INewPost } from '@entities/post'
import { usePostsUI } from '@shared/store/posts-ui'

export const usePostFormData = () => {
  const { 
    selectedPostId, 
    showAddDialog, 
    showEditDialog, 
    setShowAddDialog, 
    setShowEditDialog, 
    setSelectedPostId 
  } = usePostsUI()

  // ID로 게시물 데이터 조회
  const { data: selectedPost, isLoading } = usePostQuery(selectedPostId!, {
    enabled: !!selectedPostId && showEditDialog
  })

  // 새 게시물 상태
  const [newPost, setNewPost] = useState<INewPost>({
    title: '',
    body: '',
    userId: 1,
  })

  // 수정할 게시물 데이터 상태 (로컬 편집용)
  const [editingPost, setEditingPost] = useState({ title: '', body: '' })

  // 게시물 추가 뮤테이션
  const addPostMutation = useAddPostMutation()

  // 게시물 수정 뮤테이션
  const updatePostMutation = useUpdatePostMutation()

  // 수정 모드에서 데이터 로드 시 편집 상태 초기화
  useEffect(() => {
    if (selectedPost && showEditDialog) {
      setEditingPost({
        title: selectedPost.title || '',
        body: selectedPost.body || ''
      })
    }
  }, [selectedPost, showEditDialog])

  // 추가 다이얼로그 핸들러
  const handleAddPost = () => {
    addPostMutation.mutate(newPost, {
      onSuccess: () => {
        setShowAddDialog(false)
        setNewPost({ title: '', body: '', userId: 1 })
      },
    })
  }

  // 수정 다이얼로그 핸들러
  const handleUpdatePost = () => {
    if (selectedPost) {
      updatePostMutation.mutate(
        { ...selectedPost, title: editingPost.title, body: editingPost.body },
        {
          onSuccess: () => {
            setShowEditDialog(false)
            setSelectedPostId(null)
            setEditingPost({ title: '', body: '' })
          },
        }
      )
    }
  }

  // 추가 다이얼로그 닫기
  const handleCloseAddDialog = () => {
    setShowAddDialog(false)
    setNewPost({ title: '', body: '', userId: 1 })
  }

  // 수정 다이얼로그 닫기
  const handleCloseEditDialog = () => {
    setShowEditDialog(false)
    setSelectedPostId(null)
    setEditingPost({ title: '', body: '' })
  }

  return {
    // State
    showAddDialog,
    showEditDialog,
    newPost,
    setNewPost,
    editingPost,
    setEditingPost,
    selectedPost,
    isLoading,
    
    // Mutations
    addPostMutation,
    updatePostMutation,
    
    // Handlers
    handleAddPost,
    handleUpdatePost,
    handleCloseAddDialog,
    handleCloseEditDialog,
  }
}