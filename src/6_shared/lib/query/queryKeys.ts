import { AllFilterParams } from '@/entities/post';
import { GetUsersParams, User } from '@/entities/user';

export const QUERY_DOMAINS = {
  POSTS: 'posts',
  USERS: 'users',
  COMMENTS: 'comments',
  TAGS: 'tags',
} as const;

export const QUERY_OPERATIONS = {
  LIST: 'list',
  DETAIL: 'detail',
  INFINITE: 'infinite',
  SEARCH: 'search',
  COUNT: 'count',
} as const;

const postQueryKeys = {
  all: [QUERY_DOMAINS.POSTS] as const,

  lists: () => [QUERY_DOMAINS.POSTS, QUERY_OPERATIONS.LIST] as const,
  list: (params: Partial<AllFilterParams>) =>
    [...postQueryKeys.lists(), params] as const,
} as const;

const userQueryKeys = {
  all: [QUERY_DOMAINS.USERS] as const,

  lists: () => [QUERY_DOMAINS.USERS, QUERY_OPERATIONS.LIST] as const,
  list: (params: GetUsersParams<keyof User>) =>
    [QUERY_DOMAINS.USERS, QUERY_OPERATIONS.LIST, params] as const,
  details: () => [...userQueryKeys.lists(), 'detail'] as const,
  detail: (userId: number) => [...userQueryKeys.details(), userId] as const,
} as const;

const tagQueryKeys = {
  all: [QUERY_DOMAINS.TAGS] as const,

  lists: () => [QUERY_DOMAINS.TAGS, QUERY_OPERATIONS.LIST] as const,
} as const;

const commentQueryKeys = {
  all: [QUERY_DOMAINS.COMMENTS] as const,

  lists: () => [QUERY_DOMAINS.COMMENTS, QUERY_OPERATIONS.LIST] as const,
  list: (postId: number) => [...commentQueryKeys.lists(), postId] as const,
} as const;

export const queryKeys = {
  posts: postQueryKeys,
  users: userQueryKeys,
  tags: tagQueryKeys,
  comments: commentQueryKeys,
} as const;
