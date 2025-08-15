import type { PostComment, PostsResponse } from '@/entities/posts';

export interface UpdatePostCommentRequest {
  body: string;
}

export type UpdatePostCommentResponse = PostComment;

export interface AddCommentRequest {
  postId: number;
  body: string;
  userId: number;
}

export type AddCommentResponse = Pick<
  PostComment,
  'id' | 'body' | 'postId' | 'user'
>;

export interface AddPostRequest {
  title: string;
  body: string;
  userId: number;
}

export type AddPostResponse = PostsResponse;
