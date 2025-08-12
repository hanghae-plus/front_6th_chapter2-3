import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Dialog"
import { usePostStore } from "../model/store"
import { CommentList } from "../../comment/ui/CommentList"
import { usePostManagement } from "../../../features/postManagement/model/usePostManagement"
import { useSearch } from "../../../features/searchPosts/model/useSearch"
import { useCommentApi } from "../../comment/api"
import { highlightText } from "../../../shared/utils/highlightText"

const PostDetailDialog = () => {
  const { selectedPost } = usePostStore()
  const { searchQuery } = useSearch()
  const { getComments } = useCommentApi()
  const { showPostDetailDialog, setShowPostDetailDialog } = usePostManagement()

  useEffect(() => {
    if (selectedPost && showPostDetailDialog) {
      getComments(selectedPost.id)
    }
  }, [selectedPost, showPostDetailDialog, getComments])

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

export default PostDetailDialog
