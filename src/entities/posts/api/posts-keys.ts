import { FetchPostsParams } from "../model/types";

export const postsKeys = {
  all: ['posts'] as const,
  lists: () => [...postsKeys.all, 'list'] as const,
  list: (params: FetchPostsParams) => [...postsKeys.lists(), params] as const,
  details: () => [...postsKeys.all, 'detail'] as const,
  detail: (id: number) => [...postsKeys.details(), id] as const,
  search: (query: string) => [...postsKeys.all, 'search', query] as const,
  byTag: (tag: string) => [...postsKeys.all, 'tag', tag] as const,
  tags: () => [...postsKeys.all, 'tags'] as const,
};