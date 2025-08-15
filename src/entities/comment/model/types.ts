export interface CommentsType {
  comments: CommentType[];
  limit: number;
  skip: number;
  total: number;
}

export interface CommentType {
  id: number;
  body: string;
  likes: number;
  postId: number;
  user: CommentUserType;
}
export interface CommentUserType {
  fullName: string;
  id: number;
  username: string;
}

// 댓글 조회
export type GetCommentsResponseType = CommentsType;

// 댓글 추가
export interface PostCommentRequestType {
  body: string;
  postId: number | null;
  userId: number;
}
export interface PostCommentResponseType {
  id: number;
  body: string;
  postId: number;
  user: CommentUserType;
}

// 댓글 수정
export interface PutCommentRequestType {
  id: number;
  body: string;
}
export type PutCommentResponseType = CommentType;

// 댓글 삭제
export interface DeleteCommentRequestType {
  id: number;
  postId: number;
}

// 댓글 좋아요
export interface LikeCommentRequestType {
  id: number;
  currentLikes: number;
  postId: number;
}
