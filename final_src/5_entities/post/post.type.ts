import { EmptyStringable, PaginationMeta, SortOrder } from '@/shared/types';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  reactions?: PostReactions;
}

export interface DeletedPost {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: PostReactions;
  views: number;
  userId: number;
  isDeleted: boolean;
  deletedOn: string;
}

export interface PostReactions {
  likes: number;
  dislikes: number;
}

export interface GetPostsResponse extends PaginationMeta {
  posts: Post[];
}

export interface BaseFilterParams {
  limit: number;
  skip: number;
  sortBy?: EmptyStringable<SORT_BY>;
  sortOrder?: SortOrder;
}

export interface AllFilterParams extends BaseFilterParams {
  searchQuery: EmptyStringable<string>;
  selectedTag: EmptyStringable<string>;
}

export interface ParamsWithTag extends BaseFilterParams {
  selectedTag: EmptyStringable<string>;
}

export interface ParamsWithSearch extends BaseFilterParams {
  searchQuery: EmptyStringable<string>;
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
