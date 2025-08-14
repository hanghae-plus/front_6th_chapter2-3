import { useAtom } from "jotai"
import { selectedPostForDetailAtom, showPostDetailDialogAtom } from "./atoms"
import type { Post } from "../../../entities/post/model"

export const usePostDetail = () => {
  const [selectedPost, setSelectedPost] = useAtom(selectedPostForDetailAtom)
  const [showDialog, setShowDialog] = useAtom(showPostDetailDialogAtom)

  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowDialog(true)
  }

  const closeDialog = () => {
    setShowDialog(false)
    setSelectedPost(null)
  }

  return {
    selectedPost,
    showDialog,
    openPostDetail,
    closeDialog,
  }
}
