import { useAtom } from "jotai"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import { selectedPostAtom, showEditDialogAtom, postsAtom } from "../../../app/store"

export const EditPostModal = () => {
  const [showEditDialog, setShowEditDialog] = useAtom(showEditDialogAtom)
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom)
  const [, setPosts] = useAtom(postsAtom)

  const handleUpdatePost = async () => {
    if (!selectedPost) return
    try {
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPost),
      })
      const data = await response.json()
      
      // 수정된 게시물에 author 정보 추가 (기존 author 정보 유지)
      const postWithAuthor = {
        ...data,
        author: selectedPost.author
      }
      
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === data.id ? postWithAuthor : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedPost(selectedPost ? { ...selectedPost, title: e.target.value } : null)}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSelectedPost(selectedPost ? { ...selectedPost, body: e.target.value } : null)}
          />
          <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
