import { useState, useEffect } from "react"
import { useDialogActions, useDialogStore } from "@/shared/model/useDialogStore"
import { PostWithAuthor } from "@/shared/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"
import { useUpdatePost } from "../model/useUpdatePost"
import { usePostDetail } from "../../read-post/model/usePostDetail"

interface EditPostDialogProps {
  postId: number | null
}

export const EditPostDialog = ({ postId }: EditPostDialogProps) => {
  const { data, isLoading, error } = usePostDetail(postId!)

  // 로컬 상태로 수정 중인 데이터 관리
  const [editingPost, setEditingPost] = useState<PostWithAuthor | null>(null)

  const isOpen = useDialogStore((state) => state.dialogs.EDIT)
  const { hideDialog } = useDialogActions()
  const { updatePost, isPending } = useUpdatePost()

  // data가 변경될 때마다 로컬 상태 초기화
  useEffect(() => {
    if (data?.post) {
      setEditingPost({ ...data.post })
    }
  }, [data])

  const handleUpdate = () => {
    console.log(editingPost)
    if (!editingPost) return

    updatePost({
      id: editingPost.id,
      data: {
        title: editingPost.title,
        body: editingPost.body,
      },
    })
    hideDialog("EDIT")
  }

  const handleClose = () => {
    hideDialog("EDIT")
  }

  if (!postId || !isOpen) return null

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={() => handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>로딩 중</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-8">로딩 중...</div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !data || !editingPost) {
    return (
      <Dialog open={isOpen} onOpenChange={() => handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>오류</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-8 text-red-500">데이터를 불러오는데 실패했습니다.</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={editingPost.title}
            onChange={(e) => {
              setEditingPost((prev) => (prev ? { ...prev, title: e.target.value } : null))
            }}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={editingPost.body}
            onChange={(e) => {
              setEditingPost((prev) => (prev ? { ...prev, body: e.target.value } : null))
            }}
          />
          <Button onClick={handleUpdate} disabled={isPending}>
            {isPending ? "업데이트 중..." : "게시물 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
