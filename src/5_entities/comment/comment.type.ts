import { PaginationResponse } from '@/shared/types';

import { User } from '../user';

// ? Comment에 User도 포함되는데 Entity에 넣는게 맞나?
export interface Comment {
  id: number;
  postId: number;
  body: string;
  user: User;
  likes: number;
}

export interface CommentToCreate {
  body: string;
  postId: number;
  userId: number;
}

export interface DeletedComment extends Comment {
  isDeleted: boolean;
  deletedOn: string;
}

export type CreatedComment = CommentToCreate;

export interface GetCommentsResponse extends PaginationResponse {
  comments: Comment[];
}
