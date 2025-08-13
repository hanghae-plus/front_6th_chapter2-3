import type { Post, PostComment, PostTag } from './data-type';
import type { Pagination } from '@/shared/model/types';

export interface PostsResponse extends Pagination {
  posts: Post[];
}

export interface PostCommentsResponse extends Pagination {
  comments: PostComment[];
}

export type PostsTagsResponse = PostTag[];

export type AddPostCommentResponse = Pick<
  PostComment,
  'id' | 'body' | 'postId' | 'user'
>;

export interface UpdatePostCommentRequest {
  body: string;
}

export type UpdatePostCommentResponse = PostComment;

export interface AddPostRequest {
  title: string;
  body: string;
  userId: number;
}

export type AddPostResponse = Post;
