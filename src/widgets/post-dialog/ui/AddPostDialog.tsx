import { useAtom } from "jotai"
import { DialogLayout, Input, Textarea, Button } from "../../../shared/ui/index"
import { showAddDialogAtom, newPostAtom } from "../../../store/postsAtoms"
import { usePosts } from "../../../features/post/model/usePosts"

export const AddPostDialog = () => {
  const [open, setOpen] = useAtom(showAddDialogAtom)
  const [newPost, setNewPost] = useAtom(newPostAtom)
  const { addPost } = usePosts()

  const handleAddPost = async () => {
    try {
      await addPost(newPost)
      setOpen(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  return (
    <DialogLayout open={open} onOpenChange={setOpen} title="새 게시물 추가">
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
        <Button onClick={handleAddPost}>게시물 추가</Button>
      </div>
    </DialogLayout>
  )
}
