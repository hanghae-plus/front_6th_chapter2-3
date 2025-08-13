export const TAG_QUERY_KEYS = {
  all: ["tags"] as const,
  lists: () => [...TAG_QUERY_KEYS.all, "list"] as const,
}
