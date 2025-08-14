export const userKeys = {
  all: ["users"],
  list: () => [...userKeys.all, "list"],
  detail: (id: number) => [...userKeys.all, "detail", id],
} as const
