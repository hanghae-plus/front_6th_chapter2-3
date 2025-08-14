export const postKeys = {
  all: ["posts"],
  list: (limit: number, skip: number) => [...postKeys.all, "list", { limit, skip }],
  search: (search: string) => [...postKeys.all, "search", { search }],
  tag: (tag: string) => [...postKeys.all, "tag", { tag }],
  detail: (id: number) => [...postKeys.all, "detail", id],
} as const
