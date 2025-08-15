import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea, Button } from "../components"
import { useApp } from "../hooks/useApp"
import { usePosts } from "../hooks/usePosts"

export function PostEditDialog() {
  const { posts, setPosts } = usePosts()
  const { selectedPost, setSelectedPost, showEditDialog, setShowEditDialog } = useApp()

  // 게시물 업데이트
  async function handlePostUpdate() {
    try {
      const response = await fetch(`/api/posts/${selectedPost?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPost),
      })
      const data = await response.json()
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  function handlePostTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedPost({ ...selectedPost, title: e.target.value })
  }

  function handlePostBodyChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setSelectedPost({ ...selectedPost, body: e.target.value })
  }

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={selectedPost?.title || ""} onChange={handlePostTitleChange} />
          <Textarea rows={15} placeholder="내용" value={selectedPost?.body || ""} onChange={handlePostBodyChange} />
          <Button onClick={handlePostUpdate}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
