export interface CommentUser {
  id: number
  username: string
  fullName: string
}

export interface Comment {
  id: number
  body: string
  postId: number
  likes: number
  user: CommentUser
}

export type CommentId = Comment["id"]

export interface CommentsOfPost {
  comments: Comment[]
  total: number
  skip: number
  limit: number
}

export interface CommentInput {
  body: string
  postId: number | null
  userId: number
}

export const account = {
  id: 1,
  username: "John",
  fullName: "Doe",
}

export const initialCommentsOfPost: CommentsOfPost = { comments: [], total: 0, skip: 0, limit: 0 }

export const addCommentsOfPost = (commentsOfPost: CommentsOfPost = initialCommentsOfPost, data: CommentInput) => {
  return {
    ...commentsOfPost,
    comments: [
      ...commentsOfPost.comments,
      {
        ...data,
        id: commentsOfPost.comments.length + 1,
        likes: 0,
        user: {
          id: data.userId,
          username: account.username,
          fullName: account.fullName,
        },
      },
    ],
  }
}

export const updateCommentOfPost = (
  commentsOfPost: CommentsOfPost | undefined,
  commentId: number,
  data: Partial<Comment>,
) => {
  if (!commentsOfPost) return commentsOfPost
  return {
    ...commentsOfPost,
    comments: commentsOfPost.comments.map((c) => (c.id === commentId ? { ...c, ...data } : c)),
  }
}

export const removeCommentOfPost = (commentsOfPost: CommentsOfPost | undefined, commentId: number) => {
  if (!commentsOfPost) return commentsOfPost
  return {
    ...commentsOfPost,
    comments: commentsOfPost.comments.filter((c) => c.id !== commentId),
  }
}
