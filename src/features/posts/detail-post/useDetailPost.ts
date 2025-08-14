import { useState } from "react"
import { useModal } from "../../open-modal/useModal"
import { PostItem } from "../../../entities/post/model"

export const useDetailPost = () => {
  const modal = useModal("detailPost")
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null)

  const handleClickDetailPost = (post: PostItem) => {
    setSelectedPost(post)
    modal.open()
  }

  return {
    state: {
      selectedPost,
    },
    actions: {
      detail: handleClickDetailPost,
    },
    modal,
  }
}
