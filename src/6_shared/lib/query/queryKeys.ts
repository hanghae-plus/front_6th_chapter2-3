import { GetUsersParams } from '@/entities/user';

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

export type QueryDomain = (typeof QUERY_DOMAINS)[keyof typeof QUERY_DOMAINS];
export type QueryOperation =
  (typeof QUERY_OPERATIONS)[keyof typeof QUERY_OPERATIONS];

export type QueryKey = readonly [QueryDomain, ...unknown[]];

const postQueryKeys = {
  all: [QUERY_DOMAINS.POSTS] as const,

  lists: () => [QUERY_DOMAINS.POSTS, QUERY_OPERATIONS.LIST] as const,
  list: (params: { limit?: number; skip?: number; tag?: string }) =>
    [...postQueryKeys.lists(), params] as const,

  searches: () => [QUERY_DOMAINS.POSTS, QUERY_OPERATIONS.SEARCH] as const,
  search: (query: string) => [...postQueryKeys.searches(), { query }] as const,

  infinite: (params: { limit?: number; tag?: string }) =>
    [QUERY_DOMAINS.POSTS, QUERY_OPERATIONS.INFINITE, params] as const,

  count: (filters?: Record<string, unknown>) =>
    [QUERY_DOMAINS.POSTS, QUERY_OPERATIONS.COUNT, filters] as const,
} as const;

const userQueryKeys = {
  all: [QUERY_DOMAINS.USERS] as const,

  lists: () => [QUERY_DOMAINS.USERS, QUERY_OPERATIONS.LIST] as const,
  list: (params: GetUsersParams) =>
    [QUERY_DOMAINS.USERS, QUERY_OPERATIONS.LIST, params] as const,
} as const;

const tagQueryKeys = {
  all: [QUERY_DOMAINS.TAGS] as const,

  lists: () => [QUERY_DOMAINS.TAGS, QUERY_OPERATIONS.LIST] as const,
} as const;

export const queryKeys = {
  posts: postQueryKeys,
  users: userQueryKeys,
  tags: tagQueryKeys,
} as const;
