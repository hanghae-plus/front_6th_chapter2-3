import { User } from '../user';

// ? Comment에 User도 포함되는데 Entity에 넣는게 맞나?
export interface Comment {
  id: number;
  postId: number;
  body: string;
  user: User;
  likes: number;
}

export interface DeletedComment extends Comment {
  isDeleted: boolean;
  deletedOn: string;
}

export type CreatedComment = Omit<Comment, 'likes'>;
