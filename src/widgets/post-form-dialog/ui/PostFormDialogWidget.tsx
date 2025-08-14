import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/Dialog'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { Textarea } from '@shared/ui/Textarea'
import { usePostFormData } from '../model/usePostFormData'

export const PostFormDialogWidget = () => {
  const {
    showAddDialog,
    showEditDialog,
    newPost,
    setNewPost,
    editingPost,
    setEditingPost,
    selectedPost,
    isLoading,
    addPostMutation,
    updatePostMutation,
    handleAddPost,
    handleUpdatePost,
    handleCloseAddDialog,
    handleCloseEditDialog,
  } = usePostFormData()

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