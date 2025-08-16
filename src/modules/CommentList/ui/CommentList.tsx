import { CommentButtonAdd } from "@/features/comment/ui/CommentButtonAdd.tsx"
import { CommentListItem } from "@/modules/CommentList/ui/CommentListItem.tsx"

import { PostId } from "@/entities/Post"
import { useQueryComments } from "@/features/comment/api/useQueryComments"

// ui/CommentList.tsx
export function CommentList({ postId }: { postId: PostId }) {
  const { data: commentsOfPost } = useQueryComments(postId)

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <CommentButtonAdd postId={postId} />
      </div>

      <div className="space-y-1">
        {commentsOfPost?.comments?.map((comment) => (
          <CommentListItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
