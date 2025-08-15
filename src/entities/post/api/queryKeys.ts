export const postQueryKeys = {
  all: ["posts"] as const,
  lists: () => [...postQueryKeys.all, "list"] as const,
  list: (params: {
    limit: number;
    skip: number;
    sortBy?: string;
    sortOrder?: string;
  }) => [...postQueryKeys.lists(), params] as const,
  search: (
    query: string,
    params?: {
      limit?: number;
      skip?: number;
      sortBy?: string;
      sortOrder?: string;
    },
  ) => [...postQueryKeys.all, "search", query, params] as const,
  byTag: (
    tag: string,
    params?: {
      limit?: number;
      skip?: number;
      sortBy?: string;
      sortOrder?: string;
    },
  ) => [...postQueryKeys.all, "tag", tag, params] as const,
  tags: () => [...postQueryKeys.all, "tags"] as const,
  details: () => [...postQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...postQueryKeys.details(), id] as const,
} as const;
