import { updatePostsApi } from '@/entities/post/api/updatePosts'

export const useUpdatePosts = (
  selectedPost: any,
  posts: any[],
  setPosts: React.Dispatch<React.SetStateAction<any[]>>,
  setShowEditDialog: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async () => {
    try {
      const data = await updatePostsApi(selectedPost)
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error('게시물 업데이트 오류:', error)
    }
  }
}
