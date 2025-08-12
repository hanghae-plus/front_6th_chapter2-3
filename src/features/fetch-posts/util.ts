import { PostItem } from "../../entities/post/model"
import { User } from "../../entities/user/model"

export const joinPostsWithUsers = (posts: PostItem[], users: Pick<User, "id" | "username" | "image">[]) => {
  return posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.author?.id),
  }))
}
