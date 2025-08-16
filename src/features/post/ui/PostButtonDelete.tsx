// features/post/ui
import { useMutationPostDelete } from "../api/useMutationPostDelete"
import { Button } from "@/shared/ui"
import type { Post, PostId } from "@/entities/Post"
import { Trash2 } from "lucide-react"

export function PostButtonDelete({ post }: { post: Post }) {
  const { mutate: deletePost } = useMutationPostDelete()

  // 게시물 삭제
  async function handlePostDelete(postId: PostId) {
    deletePost(postId)
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => handlePostDelete(post.id)}>
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
