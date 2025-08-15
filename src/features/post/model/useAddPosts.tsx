import { addPostsApi } from '@/entities/post/api/addPosts'

export const useAddPosts = (
  posts: any[],
  setPosts: React.Dispatch<React.SetStateAction<any[]>>,
  setShowAddDialog: React.Dispatch<React.SetStateAction<boolean>>,
  newPost: any,
  setNewPost: React.Dispatch<React.SetStateAction<any>>
) => {
  return async () => {
    try {
      const data = await addPostsApi(newPost)

      setPosts([data, ...posts])
      console.log('게시물 추가 성공:', posts)
      setShowAddDialog(false)
      setNewPost({ title: '', body: '', userId: 1 })
    } catch (error) {
      console.error('게시물 추가 오류:', error)
    }
  }
}
