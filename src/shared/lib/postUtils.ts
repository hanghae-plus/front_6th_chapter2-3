import { Post, Author } from "@/entities/post/model"
import { User } from "@/entities/user/model"

export const createUserMap = (users: User[]): Map<number, User> => {
  return new Map(users.map((user) => [user.id, user]))
}

export const enrichPostsWithAuthors = (posts: Post[], userMap: Map<number, User>): (Post & { author: Author })[] => {
  return posts.map((post) => ({
    ...post,
    author: userMap.get(post.userId) as Author,
  }))
}

export const determinePostsDataFunction = (
  searchQuery?: string,
  selectedTag?: string,
): "search" | "tag" | "default" => {
  if (searchQuery) return "search"
  if (selectedTag && selectedTag !== "all") return "tag"
  return "default"
}
