//http://localhost:5173/api/comments/post
interface CommentsUser {
  fullName: string;
  id: number;
  username: string;
}
export interface Comments {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: CommentsUser;
}

export interface CommentsResponse {
  comments: Comments;
  limit: number;
  skip: number;
  total: number;
}
//POST http://localhost:5173/api/comments/add
export interface PostAddComment {
  body: string;
  postId: number;
  userId: number;
}
//DELETE http://localhost:5173/api/comments/84
export interface DeleteComment {
  deleteOn: string;
  isDeleted: true;
  id: number;
  body: string;
  likes: number;
  postId: number;
  user: CommentsUser;
}

// PATCH http://localhost:5173/api/comments/196
export type PatchCommentsDetailRequest = Pick<Comments, 'id' | 'likes'>;
export type PatchCommentsDetailResponse = Comments;

// PUT http://localhost:5173/api/comments/196
export type PutCommentsDetail = Pick<Comments, 'id' | 'body'>;
export type PutCommentsDetailResponse = Comments;
