import { Button, Dialog, Input, Textarea } from "../../../shared"
import { usePostForm, useSelectedPostStore } from "../model"

export const PostEditDialog = () => {
  const { selectedPost, showEditDialog, setShowEditDialog } = useSelectedPostStore()
  const { updatePost, handleChangeSelectedPost } = usePostForm()

  return (
    <Dialog open={showEditDialog} handleChange={setShowEditDialog} title="게시물 수정">
      <div className="space-y-4">
        <Input placeholder="제목" value={selectedPost?.title || ""} name="title" onChange={handleChangeSelectedPost} />
        <Textarea
          rows={15}
          placeholder="내용"
          value={selectedPost?.body || ""}
          name="body"
          onChange={handleChangeSelectedPost}
        />
        <Button onClick={updatePost}>게시물 업데이트</Button>
      </div>
    </Dialog>
  )
}
