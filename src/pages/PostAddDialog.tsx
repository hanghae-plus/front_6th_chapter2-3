import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../components"
// import { createPost } from "../entities/Post/api"
import { useApp } from "../hooks/useApp"
import { usePosts } from "../hooks/usePosts"
import { useState } from "react"

export function PostAddDialog() {
  const { showPostAddDialog: showAddDialog, setShowPostAddDialog: setShowAddDialog } = useApp()
  // const { posts, setPosts } = usePosts()
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 })

  function handleChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
    setNewPost({ ...newPost, title: e.target.value })
  }

  function handleChangeBody(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNewPost({ ...newPost, body: e.target.value })
  }

  function handleChangeUserId(e: React.ChangeEvent<HTMLInputElement>) {
    setNewPost({ ...newPost, userId: Number(e.target.value) })
  }

  // 게시물 추가
  async function handlePostAdd() {
    // try {
    //   const data = await createPost(newPost)
    //   setPosts([data, ...posts])
    //   setNewPost({ title: "", body: "", userId: 1 })
    //   setShowAddDialog(false)
    // } catch (error) {
    //   console.error("게시물 추가 오류:", error)
    // }
  }

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="제목" value={newPost.title} onChange={handleChangeTitle} />
          <Textarea rows={30} placeholder="내용" value={newPost.body} onChange={handleChangeBody} />
          <Input type="number" placeholder="사용자 ID" value={newPost.userId} onChange={handleChangeUserId} />
          <Button onClick={handlePostAdd}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
