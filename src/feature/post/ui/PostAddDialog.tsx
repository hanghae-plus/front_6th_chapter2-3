import { useState } from "react"
import { Button, Dialog, Input, Textarea } from "../../../shared/ui"
import { NewPost } from "../type"
import { useSelectedPostStore } from "../model/store"
import { requestApi } from "../../../shared/lib"
import { Post } from "../../../entities"

export const PostAddDialog = () => {
  const { showAddDialog, setShowAddDialog, setPosts, posts } = useSelectedPostStore()
  const [newPost, setNewPost] = useState<NewPost>({ title: "", body: "", userId: 1 })
  // 게시물 추가
  const addPost = async () => {
    try {
      const { result, data } = await requestApi<Post>(`/api/posts/add`, {
        method: "POST",
        body: newPost,
      })
      if (result && data) {
        setPosts([
          {
            ...data,
            reactions: { likes: 0, dislikes: 0 },
            tags: [],
            views: 0,
          },
          ...posts,
        ])
      }

      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

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
