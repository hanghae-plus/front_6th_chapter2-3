import { User } from '../../../shared/types/common';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  author?: User; // author 필드 추가 (선택적)
}

export interface NewPost {
  title: string;
  body: string;
  userId: number;
}

export interface PostWithUser extends Post {
  author: User | undefined;
}

export type { User };
