import { Button, Dialog, Input, Textarea } from "../../../shared/ui"
import { NewPost } from "../type"

export const PostAddDialog = ({
  showAddDialog,
  setShowAddDialog,
  newPost,
  setNewPost,
  addPost,
}: {
  showAddDialog: boolean
  setShowAddDialog: React.Dispatch<React.SetStateAction<boolean>>
  newPost: NewPost
  setNewPost: React.Dispatch<React.SetStateAction<NewPost>>
  addPost: () => Promise<void>
}) => {
  return (
    <Dialog open={showAddDialog} handleChange={setShowAddDialog} title="새 게시물 추가">
      <div className="space-y-4">
        <Input
          placeholder="제목"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <Textarea
          rows={30}
          placeholder="내용"
          value={newPost.body}
          onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
        />
        <Input
          type="number"
          placeholder="사용자 ID"
          value={newPost.userId}
          onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
        />
        <Button onClick={addPost}>게시물 추가</Button>
      </div>
    </Dialog>
  )
}
