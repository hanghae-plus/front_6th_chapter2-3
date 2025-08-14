/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Dialog, Input, Textarea } from "@/shared/ui"

type PostUpdateDialogProps = {
  showEditDialog: any
  setShowEditDialog: any
  setSelectedPost: any
  selectedPost: any
  updatePost: any
}

export function PostUpdateDialog({
  selectedPost,
  setSelectedPost,
  setShowEditDialog,
  showEditDialog,
  updatePost,
}: PostUpdateDialogProps) {
  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>게시물 수정</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
          />
          <Button onClick={updatePost}>게시물 업데이트</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
