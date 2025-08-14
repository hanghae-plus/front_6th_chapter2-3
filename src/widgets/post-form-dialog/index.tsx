import { useState, useEffect } from 'react'
import { useAddPostMutation } from '@features/post/create-post'
import { useUpdatePostMutation } from '@features/post/update-post'
import { usePostQuery } from '@features/post/get-single-post'
import { INewPost } from '@entities/post'
import { usePostsUI } from '@shared/store/posts-ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/Dialog'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { Textarea } from '@shared/ui/Textarea'

export const PostFormDialogWidget = () => {
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

  // 게시물 추가 뮤테이션
  const addPostMutation = useAddPostMutation()

  // 게시물 수정 뮤테이션
  const updatePostMutation = useUpdatePostMutation()

  // 수정 모드일 때 선택된 게시물로 폼 초기화
  useEffect(() => {
    if (showEditDialog && selectedPost) {
      // 수정 모드에서는 selectedPost 자체를 사용
    }
  }, [showEditDialog, selectedPost])

  // 추가 다이얼로그 핸들러
  const handleAddPost = () => {
    addPostMutation.mutate(newPost, {
      onSuccess: () => {
        setShowAddDialog(false)
        setNewPost({ title: '', body: '', userId: 1 })
      },
    })
  }

  // 수정할 게시물 데이터 상태 (로컬 편집용)
  const [editingPost, setEditingPost] = useState({ title: '', body: '' })

  // 수정 모드에서 데이터 로드 시 편집 상태 초기화
  useEffect(() => {
    if (selectedPost && showEditDialog) {
      setEditingPost({
        title: selectedPost.title || '',
        body: selectedPost.body || ''
      })
    }
  }, [selectedPost, showEditDialog])

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

  return (
    <>
      {/* 게시물 추가 대화상자 */}
      <Dialog open={showAddDialog} onOpenChange={handleCloseAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={newPost.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <Textarea
              rows={10}
              placeholder="내용"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            />
            <Input
              type="number"
              placeholder="사용자 ID"
              value={newPost.userId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPost({ ...newPost, userId: Number(e.target.value) })
              }
            />
            <Button onClick={handleAddPost} disabled={addPostMutation.isPending}>
              {addPostMutation.isPending ? '추가 중...' : '게시물 추가'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog open={showEditDialog} onOpenChange={handleCloseEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isLoading ? (
              <div>게시물 로딩 중...</div>
            ) : (
              <>
                <Input
                  placeholder="제목"
                  value={editingPost.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditingPost({ ...editingPost, title: e.target.value })
                  }
                />
                <Textarea
                  rows={10}
                  placeholder="내용"
                  value={editingPost.body}
                  onChange={(e) => setEditingPost({ ...editingPost, body: e.target.value })}
                />
                <Button onClick={handleUpdatePost} disabled={updatePostMutation.isPending || !selectedPost}>
                  {updatePostMutation.isPending ? '수정 중...' : '게시물 업데이트'}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
