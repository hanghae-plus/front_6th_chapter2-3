import { MessageSquare } from "lucide-react"
import { PropsWithChildren } from "react"

import { Post } from "@/entities/post"
import { useModal } from "@/shared/hooks/useModal"
import { Button } from "@/shared/ui"

import { DetailPostModal } from "./PostDetailModal"

interface Props {
  post: Post
}

export const PostDetailButton = ({ children, post }: PropsWithChildren<Props>) => {
  const postDetailModal = useModal<Post>(`post-detail-${post.id}`)

  const handleOpenPostDetail = () => {
    postDetailModal.open(post)
  }

  return (
    <>
      <Button aria-label="댓글 보기" onClick={handleOpenPostDetail} size="sm" variant="ghost">
        {children || <MessageSquare className="w-4 h-4" />}
      </Button>
      <DetailPostModal modalId={`post-detail-${post.id}`} />
    </>
  )
}
