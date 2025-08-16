export interface CommentType {
  id: number;
  likes: number;
  postId: number;
  body: string;
  user: {
    fullName: string;
    username: string;
    id: number;
  };
}

export interface GetCommentsResponseType {
  comments: CommentType[];
  total: number;
  skip: number;
  limit: number;
}

export interface PostCommentRequestType {
  body: string;
  postId: number;
  userId: number;
}

export interface PutCommentRequestType {
  id: number;
  body: string;
  postId: number;
}
