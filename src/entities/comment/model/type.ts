import { IUserName } from '../../user/model/type';

// 댓글 타입
export type IComment = {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: IUserName;
};

export type IAddComment = {
  userId: number;
  postId: number | null;
  body: string;
};

export type IAddCommentResponse = Pick<
  IComment,
  'id' | 'postId' | 'body' | 'user'
>;

export type IEditComment = Pick<IComment, 'body'>;

export type IEditCommentResponse = IComment;

export type IComments = {
  comments: IComment[];
  total: string;
  skip: number;
  limit: number;
};

export type ICommentsByPostId = {
  [postId: number]: IComment[];
};
