import { highlightText } from "@/shared/lib/highlightText.tsx"
import { CommentList } from "@/modules/CommentList/ui/CommentList.tsx"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { usePost } from "@/features/post/model/usePost.ts"
import { usePostDialog } from "@/features/post/model/usePostDialog.ts"
import { usePostRouteParams } from "@/features/posts/model/usePostRouteParams.ts"

export default function PostDialogDetail() {
  const { showPostDetailDialog, setShowPostDetailDialog } = usePostDialog()
  const { selectedPost } = usePost()
  const { searchQuery } = usePostRouteParams()

  if (!selectedPost) return null
  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost.title, searchQuery)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>{highlightText(selectedPost.body, searchQuery)}</p>
          <CommentList postId={selectedPost.id} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
