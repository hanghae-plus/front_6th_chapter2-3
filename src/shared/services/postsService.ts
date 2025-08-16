import { Post } from "../../types/product.type"
import { User } from "../../types/user.type"

// 게시물과 사용자 정보를 결합하는 서비스 함수
export const enrichPostsWithUsers = async (
  posts: Post[],
  getUserById: (userId: number) => Promise<User>,
): Promise<Post[]> => {
  return Promise.all(
    posts.map(async (post) => ({
      ...post,
      author: await getUserById(post.userId),
    })),
  )
}

// 게시물 검색 로직
export const searchPostsLogic = (posts: Post[], query: string): Post[] => {
  if (!query.trim()) return posts

  const lowerQuery = query.toLowerCase()
  return posts.filter(
    (post) => post.title.toLowerCase().includes(lowerQuery) || post.body.toLowerCase().includes(lowerQuery),
  )
}

// 게시물 정렬 로직
export const sortPosts = (posts: Post[], sortBy: string, sortOrder: string): Post[] => {
  const sortedPosts = [...posts]

  switch (sortBy) {
    case "id":
      sortedPosts.sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id))
      break
    case "title":
      sortedPosts.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title)
        return sortOrder === "asc" ? comparison : -comparison
      })
      break
    case "reactions":
      sortedPosts.sort((a, b) => {
        const aReactions = (a.reactions?.likes || 0) + (a.reactions?.dislikes || 0)
        const bReactions = (b.reactions?.likes || 0) + (b.reactions?.dislikes || 0)
        return sortOrder === "asc" ? aReactions - bReactions : bReactions - aReactions
      })
      break
    default:
      break
  }

  return sortedPosts
}
