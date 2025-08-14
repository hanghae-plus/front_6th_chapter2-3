export const tagKeys = {
  all: ["tags"],
  list: () => [...tagKeys.all, "list"],
} as const
