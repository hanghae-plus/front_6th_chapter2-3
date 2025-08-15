import type { Post, PostComment, PostTag } from './data-type';
import type { Pagination } from '@/shared/model/types';

export interface PostsResponse extends Pagination {
  posts: Post[];
}

export interface PostCommentsResponse extends Pagination {
  comments: PostComment[];
}

export type PostsTagsResponse = PostTag[];
