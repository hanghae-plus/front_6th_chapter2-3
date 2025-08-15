import { DialogLayout, Input, Textarea, Button } from "../../../shared/ui/index"
import { Post } from "../../../types"
import { usePosts } from "../../../features/post/model/usePosts"
import { useOpenEditPost } from "../../../features/post/model/useOpenEditPost"
import { useEffect, useState } from "react"

export const EditPostDialog = () => {
  const { editPost, isEditModalOpen, closeEditPost } = useOpenEditPost()
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const { updatePost } = usePosts()

  useEffect(() => {
    if (editPost) {
      setEditingPost({ ...editPost })
    }
  }, [editPost])

  const handleUpdate = async () => {
    if (editingPost) {
      try {
        await updatePost(editingPost)
        closeEditPost()
        setEditingPost(null)
      } catch (error) {
        console.error("게시물 수정 오류:", error)
      }
    }
  }

  return (
    <DialogLayout open={isEditModalOpen} onOpenChange={closeEditPost} title="게시물 수정">
      <div className="space-y-4">
        <Input
          placeholder="제목"
          value={editingPost?.title || ""}
          onChange={(e) => editingPost && setEditingPost({ ...editingPost, title: e.target.value })}
        />
        <Textarea
          rows={15}
          placeholder="내용"
          value={editingPost?.body || ""}
          onChange={(e) => editingPost && setEditingPost({ ...editingPost, body: e.target.value })}
        />
        <Button onClick={handleUpdate}>게시물 업데이트</Button>
      </div>
    </DialogLayout>
  )
}
