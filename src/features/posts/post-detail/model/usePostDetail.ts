import { usePostDialogs } from "../../../../shared/store"
import type { PostsWithUsers } from "../../post-list/ui/PostList"
import { useCommentList } from "../../../comments/comment-list"
import { useSelectedPost } from "../../model"

export const usePostDetail = () => {
  const { setShowPostDetailDialog } = usePostDialogs()
  const { setSelectedPost } = useSelectedPost()
  const { fetchComments } = useCommentList()

  const openPostDetail = (post: PostsWithUsers) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  return { openPostDetail }
}
