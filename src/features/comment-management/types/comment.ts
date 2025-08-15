import { PageData } from "@/shared/types"

/** 댓글 */
export interface Comment {
  body: string
  id: number
  likes: number
  postId: number
  user: CommentUser
}

/** 댓글 응답 */
export interface CommentResponse extends PageData {
  comments: Comment[]
}

/** 댓글 작성자 */
export interface CommentUser {
  fullName: string
  id: number
  username: string
}

/** 댓글 추가 */
export interface AddComment {
  body: string
  postId: number
  userId: number
}

/** 댓글 추가 응답 */
export interface AddCommentResponse extends AddComment {
  id: number
}

/**댓글 수정 */
export interface UpdateComment {
  body: string
  id: number
  likes: number
  postId: number
}

/**댓글 수정 요청 */
export interface UpdateCommentRequest {
  body: string
}
