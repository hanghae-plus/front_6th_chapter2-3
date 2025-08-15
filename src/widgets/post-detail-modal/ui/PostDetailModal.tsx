import { Post } from "@/entities/post"
import { usePostsQuery } from "@/feature/post-query"
import { highlightText } from "@/shared"
import { useModal } from "@/shared/hooks/useModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"

import { PostComments } from "./PostComments"

interface Props {
  modalId: string
}

export const DetailPostModal = ({ modalId }: Props) => {
  const { close, data: selectedPost, isOpen } = useModal<Post>(modalId)
  const { current } = usePostsQuery()

  return (
    <Dialog onOpenChange={close} open={isOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title, current.search)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body, current.search)}</p>
          {selectedPost && <PostComments postId={selectedPost.id} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
