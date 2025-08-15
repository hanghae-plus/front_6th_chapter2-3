import { useAtom } from "jotai"
import { atom } from "jotai"
import { Post } from "../../../types"

// 편집할 포스트와 모달 열림 상태를 관리하는 atom
interface EditPostState {
  post: Post | null
  isOpen: boolean
}

const editPostAtom = atom<EditPostState>({
  post: null,
  isOpen: false,
})

export const useOpenEditPost = () => {
  const [editPostState, setEditPostState] = useAtom(editPostAtom)

  const openEditPost = (post: Post) => {
    setEditPostState({
      post,
      isOpen: true,
    })
  }

  const closeEditPost = () => {
    setEditPostState({
      post: null,
      isOpen: false,
    })
  }

  return {
    editPost: editPostState.post,
    isEditModalOpen: editPostState.isOpen,
    openEditPost,
    closeEditPost,
  }
}
