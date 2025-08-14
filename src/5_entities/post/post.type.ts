import { PaginationResponse } from '@/shared/types';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  reactions?: PostReactions;
}

export interface PostReactions {
  likes: number;
  dislikes: number;
}

export interface GetPostsResponse extends PaginationResponse {
  posts: Post[];
}
