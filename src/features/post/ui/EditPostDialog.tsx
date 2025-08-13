import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDialogActions, useDialogStore } from "@/shared/model/useDialogStore"
import { PostWithAuthor } from "@/shared/types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"
import { postMutations } from "../model/mutations"

interface EditPostDialogProps {
  selectedPost: PostWithAuthor | null
  onUpdate: (post: PostWithAuthor) => void
}

export const EditPostDialog = ({ selectedPost, onUpdate }: EditPostDialogProps) => {
  const queryClient = useQueryClient()

  // 로컬 상태로 수정 중인 데이터 관리
  const [editingPost, setEditingPost] = useState<PostWithAuthor | null>(null)

  const isOpen = useDialogStore((state) => state.dialogs.EDIT)
  const { hideDialog } = useDialogActions()

  const updatePostMutation = useMutation({
    ...postMutations.update(queryClient, selectedPost?.id ?? 0),
    onSuccess: (updatedPost) => {
      // 성공 시 부모에게 업데이트된 데이터 전달
      if (selectedPost) {
        onUpdate({ ...selectedPost, ...updatedPost })
      }
      hideDialog("EDIT")
    },
  })

  // selectedPost가 변경될 때마다 로컬 상태 초기화
  useEffect(() => {
    if (selectedPost) {
      setEditingPost({ ...selectedPost })
    }
  }, [selectedPost])

  const handleUpdate = () => {
    if (!editingPost) return

    updatePostMutation.mutate({
      id: editingPost.id,
      data: {
        title: editingPost.title,
        body: editingPost.body,
      },
    })
  }

  const handleClose = () => {
    hideDialog("EDIT")
    // 다이얼로그 닫을 때 로컬 상태 초기화
    setEditingPost(null)
  }

  if (!editingPost) return null

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
          <Button onClick={handleUpdate} disabled={updatePostMutation.isPending}>
            {updatePostMutation.isPending ? "업데이트 중..." : "게시물 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
