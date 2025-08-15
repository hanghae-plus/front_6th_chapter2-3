import { useAtom } from "jotai"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import { newPostAtom, showAddDialogAtom, postsAtom } from "../../../app/store"

export const AddPostModal = () => {
  const [showAddDialog, setShowAddDialog] = useAtom(showAddDialogAtom)
  const [newPost, setNewPost] = useAtom(newPostAtom)
  const [, setPosts] = useAtom(postsAtom)

  const handleAddPost = async () => {
    try {
      const response = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
      const data = await response.json()
      
      // author 정보 가져오기
      const userResponse = await fetch(`/api/users/${newPost.userId}`)
      const userData = await userResponse.json()
      
      const postWithAuthor = {
        ...data,
        author: userData
      }
      
      setPosts((prevPosts) => [postWithAuthor, ...prevPosts])
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={handleAddPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
