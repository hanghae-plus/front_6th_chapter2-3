import { PostItem } from "../../../entities/post/model/types"
import { User } from "../../../entities/user/model/types"

export const joinPostsWithUsers = (posts: PostItem[], users: User[]) => {
  return posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.userId),
  }))
}
