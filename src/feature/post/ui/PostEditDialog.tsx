import React from "react"
import { Button, Dialog, Input, Textarea } from "../../../shared/ui"
import { useSelectedPostStore } from "../model/store"
import { requestApi } from "../../../shared/lib"
import { Post } from "../type"

export const PostEditDialog = () => {
  const { setPosts, posts, selectedPost, setSelectedPost, showEditDialog, setShowEditDialog } = useSelectedPostStore()
  // 게시물 업데이트
  const updatePost = async () => {
    try {
      const { result, data } = await requestApi<Post>(`/api/posts/${selectedPost.id}`, {
        method: "PUT",
        body: selectedPost,
      })
      if (result && data) {
        setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      }

      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  return (
    <Dialog open={showEditDialog} handleChange={setShowEditDialog} title="게시물 수정">
      <div className="space-y-4">
        <Input
          placeholder="제목"
          value={selectedPost?.title || ""}
          onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
        />
        <Textarea
          rows={15}
          placeholder="내용"
          value={selectedPost?.body || ""}
          onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
        />
        <Button onClick={updatePost}>게시물 업데이트</Button>
      </div>
    </Dialog>
  )
}
