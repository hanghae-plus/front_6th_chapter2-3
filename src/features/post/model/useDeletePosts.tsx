import { deletePostsApi } from '@/entities/post/api/deletePosts'

export const useDeletePosts = (
  posts: any[],
  setPosts: React.Dispatch<React.SetStateAction<any[]>>
) => {
  return async (id: number) => {
    try {
      await deletePostsApi(id)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error('게시물 삭제 오류:', error)
    }
  }
}
