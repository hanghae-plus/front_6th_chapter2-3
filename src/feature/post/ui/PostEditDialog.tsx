import React from "react"
import { Button, Dialog, Input, Textarea } from "../../../shared/ui"
import { Post } from "../type"

export const PostEditDialog = ({
  showEditDialog,
  setShowEditDialog,
  selectedPost,
  setSelectedPost,
  updatePost,
}: {
  showEditDialog: boolean
  setShowEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  selectedPost: Post
  setSelectedPost: (value: React.SetStateAction<Post>) => void
  updatePost: () => Promise<void>
}) => {
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
