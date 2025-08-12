import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Dialog"
import { usePostStore } from "../../../entities/post/model/store"

import { CommentList } from "./CommentList"
import { usePostsManager } from "../model/usePostsManager"
import { useSearch } from "../../../features.tsx/searchPosts/model/useSearch"
import { useCommentManagement } from "../../../features.tsx/commentManagement/model/useCommentManagement"
import { highlightText } from "../../../shared/utils/highlightText"

export const PostDetailDialog: React.FC = () => {
  const { selectedPost } = usePostStore()
  const { searchQuery } = useSearch()
  const { getComments: fetchComments } = useCommentManagement()
  const { showPostDetailDialog, setShowPostDetailDialog } = usePostsManager()

  useEffect(() => {
    if (selectedPost && showPostDetailDialog) {
      fetchComments(selectedPost.id)
    }
  }, [selectedPost, showPostDetailDialog, fetchComments])

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body || "", searchQuery)}</p>
          {selectedPost && <CommentList postId={selectedPost.id} searchQuery={searchQuery} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
