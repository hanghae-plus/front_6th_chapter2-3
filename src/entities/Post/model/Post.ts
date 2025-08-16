import { account } from "@/entities/Comment"
import { User } from "@/entities/User/model/User"

export interface PostList {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

export interface Post {
  id: number
  title: string
  body: string
  tags: string[]
  reactions: Reactions
  views: number
  userId: number

  // extends
  author: Partial<User>
}

export type PostId = Post["id"]

export interface Reactions {
  likes: number
  dislikes: number
}

const initialPost = {
  id: 0,
  title: "",
  body: "",
  tags: [],
  reactions: { likes: 0, dislikes: 0 },
  views: 0,
  userId: 0,
}

export type PostInput = Partial<Post>

export const addPosts = (postList: PostList | undefined, postInput: PostInput): PostList | undefined => {
  if (!postList) return postList
  const posts = postList.posts || []

  const post: Post = {
    ...initialPost,
    ...postInput,
    author: account,
    id: Math.floor(Math.random() * 1000000),
  }

  return {
    ...postList,
    posts: [post, ...posts],
  }
}

export const updatePosts = (postList: PostList | undefined, data: Post): PostList | undefined => {
  if (!postList) return postList
  return {
    ...postList,
    posts: postList.posts.map((post) => (post.id === data.id ? data : post)),
  }
}

export const removePost = (postList: PostList | undefined, postId: PostId) => {
  if (!postList) return postList
  return {
    ...postList,
    posts: postList.posts.filter((post) => post.id !== postId),
  }
}
