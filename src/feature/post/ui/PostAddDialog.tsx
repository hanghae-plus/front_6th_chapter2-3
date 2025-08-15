import { Button, Dialog, Input, Textarea } from "../../../shared/ui"
import { useSelectedPostStore } from "../model/store"
import { usePostForm } from "../model/hook"

export const PostAddDialog = () => {
  const { showAddDialog, setShowAddDialog } = useSelectedPostStore()
  const { newPost, addPost, handleChangeNewPost } = usePostForm()

  return (
    <Dialog open={showAddDialog} handleChange={setShowAddDialog} title="새 게시물 추가">
      <div className="space-y-4">
        <Input placeholder="제목" value={newPost.title} name="title" onChange={handleChangeNewPost} />
        <Textarea rows={30} placeholder="내용" value={newPost.body} name="body" onChange={handleChangeNewPost} />
        <Input
          type="number"
          placeholder="사용자 ID"
          value={newPost.userId}
          name="userId"
          onChange={handleChangeNewPost}
        />
        <Button onClick={addPost}>게시물 추가</Button>
      </div>
    </Dialog>
  )
}
