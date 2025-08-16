import { useMutationPostUpdate } from "../api/useMutationPostUpdate"
import { usePostDialog } from "../model/usePostDialog"
import { Button, Input, Textarea } from "@/shared/ui"
import { usePost } from "@/features/post/model/usePost.ts"

export function PostFormEdit() {
  const { selectedPost, setSelectedPost } = usePost()
  const { setShowEditDialog } = usePostDialog()
  const { mutate: mutatePostUpdate } = useMutationPostUpdate()

  function handleTitleChange(title: string) {
    setSelectedPost((selectedPost) => (!selectedPost ? null : { ...selectedPost, title }))
  }

  function handleBodyChange(body: string) {
    setSelectedPost((selectedPost) => (!selectedPost ? null : { ...selectedPost, body }))
  }

  // 게시물 업데이트
  async function handlePostUpdate() {
    if (!selectedPost) return

    mutatePostUpdate(selectedPost)
    setShowEditDialog(false)
  }

  return (
    <div className="space-y-4">
      <Input placeholder="제목" value={selectedPost?.title || ""} onChange={(e) => handleTitleChange(e.target.value)} />

      <Textarea
        rows={15}
        placeholder="내용"
        value={selectedPost?.body || ""}
        onChange={(e) => handleBodyChange(e.target.value)}
      />

      <Button onClick={handlePostUpdate}>게시물 업데이트</Button>
    </div>
  )
}
