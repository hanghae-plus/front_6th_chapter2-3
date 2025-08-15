import { useState } from "react"
import { useModal } from "../../open-modal/useModal"
import { PostItem } from "../../../entities/post/model"
import { useCommentsQuery } from "../../../entities/comment/hook"

export const useDetailPost = () => {
  const modal = useModal("detailPost")
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null)

  // 댓글 조회
  const { data: commentsData, isLoading: isCommentsLoading } = useCommentsQuery(selectedPost?.id || 0)

  /**
   * 포스트 상세 클릭 핸들러
   * @param post 포스트 아이템
   */
  const handleClickDetailPost = (post: PostItem) => {
    setSelectedPost(post)
    modal.open()
  }

  return {
    state: {
      selectedPost,
      comments: commentsData?.comments || [],
      isCommentsLoading,
    },
    actions: {
      detail: handleClickDetailPost,
    },
    modal,
  }
}
