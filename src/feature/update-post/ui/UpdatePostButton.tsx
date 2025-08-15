import { Edit2 } from "lucide-react"

import { Post } from "@/entities/post"
import { useModal } from "@/shared/hooks/useModal"
import { Button } from "@/shared/ui"

import { UpdatePostModal } from "./UpdatePostModal"

export const UpdatePostButton = ({ post }: { post: Post }) => {
  const updatePostModal = useModal<Post>(`update-post-${post.id}`)

  const handleUpdatePost = (post: Post) => {
    updatePostModal.open(post)
  }

  return (
    <>
      <Button aria-label="게시물 수정" onClick={() => handleUpdatePost(post)} size="sm" variant="ghost">
        <Edit2 className="w-3 h-3" />
      </Button>
      <UpdatePostModal modalId={`update-post-${post.id}`} />
    </>
  )
}
