import { fetchPostsApi } from '@/entities/post/api/fetchPosts'
import { fetchUsersApi } from '@/entities/user/api/fetchUsers'
import { fetchTagPostsApi } from '@/entities/post/api/fetchTagPosts'
import { Post } from '@/entities/post/model/types'
import { User } from '@/entities/user/model/types'

export const useFetchPosts = (
  limit: number,
  skip: number,
  setPosts: React.Dispatch<React.SetStateAction<any[]>>,
  setTotal: React.Dispatch<React.SetStateAction<number>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (tag: string | undefined) => {
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([
        tag && tag !== 'all'
          ? fetchTagPostsApi(tag) // 태그별
          : fetchPostsApi(limit, skip), // 전체
        fetchUsersApi(),
      ])
      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error('게시물 가져오기 오류:', error)
    }
    setLoading(false)
  }
}
