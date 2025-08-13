import type { Post } from "../model/types"
import type { User } from "@entities/user"

/**
 * 주어진 게시물 배열에 작성자 정보를 병합합니다.
 * @param posts 게시물 배열
 * @param users 사용자 배열
 * @returns author 프로퍼티가 포함된 게시물 배열
 */
export const mergePostsWithAuthors = (posts: Post[] = [], users: User[] = []): Post[] => {
  if (!posts.length || !users.length) return posts
  return posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.userId),
  }))
}