import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "../components"
import type { Post } from "../entities/Post/Post"

export function PostDialogAdd({
  showAddDialog,
  setShowAddDialog,
  setPosts,
}: {
  showAddDialog: boolean
  setShowAddDialog: (showAddDialog: boolean) => void
  setPosts: (posts: Post[]) => void
}) {
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
    try {
      const response = await fetch("/api/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
      const data = await response.json()
      setPosts([data, ...posts])
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
          <Input placeholder="제목" value={newPost.title} onChange={handleChangeTitle} />
          <Textarea rows={30} placeholder="내용" value={newPost.body} onChange={handleChangeBody} />
          <Input type="number" placeholder="사용자 ID" value={newPost.userId} onChange={handleChangeUserId} />
          <Button onClick={handlePostAdd}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
