import { EmptyStringable, PaginationMeta, SortOrder } from '@/shared/types';

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

export interface GetPostsResponse extends PaginationMeta {
  posts: Post[];
}

export interface GetPostsWithFiltersParams {
  limit: number;
  skip: number;
  searchQuery?: string;
  selectedTag?: string;
  sortBy?: EmptyStringable<SORT_BY>;
  sortOrder?: SortOrder;
}

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SORT_BY {
  NONE = 'none',
  ID = 'id',
  TITLE = 'title',
  REACTIONS = 'reactions',
}
