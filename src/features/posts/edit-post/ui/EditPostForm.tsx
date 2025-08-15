import { usePostDialogs } from "../../../../shared/store"
import { DialogHeader, Input, Textarea, Button, Dialog, DialogContent, DialogTitle } from "../../../../shared/ui"
import { useSelectedPost } from "../../model"
import { useEditPost } from "../model/useEditPost"

export const EditPostForm = () => {
  const { selectedPost, setSelectedPost } = useSelectedPost()
  const { updatePost } = useEditPost()
  const { showEditDialog, setShowEditDialog } = usePostDialogs()

  if (!selectedPost) return

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost.title || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost.body || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
          />
          <Button onClick={() => updatePost(selectedPost)}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
