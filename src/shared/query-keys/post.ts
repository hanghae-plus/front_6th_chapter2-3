// shared/query-keys/posts.ts
export type PageParams = { limit: number; skip: number };

export const postsKeys = {
  all: ["posts"] as const,
  page: (p: PageParams) => [...postsKeys.all, "page", { limit: p.limit, skip: p.skip }] as const,
  search: (q: string) => [...postsKeys.all, "search", q] as const,
  tag: (tag: string) => [...postsKeys.all, "tag", tag] as const,
  detail: (id: number) => [...postsKeys.all, "detail", id] as const,
};
