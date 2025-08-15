import { usePosts } from "./usePosts"

// 게시물 삭제 hooks
export const useRemovePost = () => {
  const { deletePost } = usePosts()

  const removePost = async (id: number) => {
    await deletePost(id)
  }

  return {
    removePost,
  }
}
