import { useMutationPostAdd } from "../api/useMutationPostAdd"
import { Button, Input, Textarea } from "@/shared/ui"
import { PostInput } from "@/entities/Post"
import { usePostDialog } from "@/features/post/model/usePostDialog.ts"
import { useState } from "react"

export function PostFormAdd() {
  const { setShowAddDialog } = usePostDialog()
  const { mutate: mutatePostAdd } = useMutationPostAdd()

  const [newPost, setNewPost] = useState<PostInput>({ title: "", body: "", userId: 1 })

  function handleTitleChange(title: string) {
    setNewPost({ ...newPost, title })
  }

  function handleBodyChange(body: string) {
    setNewPost({ ...newPost, body })
  }

  function handleUserIdChange(userId: string) {
    setNewPost({ ...newPost, userId: Number(userId) })
  }

  async function handlePostAdd() {
    mutatePostAdd(newPost)
    setShowAddDialog(false)
  }

  return (
    <div className="space-y-4">
      <Input placeholder="제목" value={newPost.title} onChange={(e) => handleTitleChange(e.target.value)} />

      <Textarea rows={30} placeholder="내용" value={newPost.body} onChange={(e) => handleBodyChange(e.target.value)} />

      <Input
        type="number"
        placeholder="사용자 ID"
        value={newPost.userId}
        onChange={(e) => handleUserIdChange(e.target.value)}
      />

      <Button onClick={handlePostAdd}>게시물 추가</Button>
    </div>
  )
}
