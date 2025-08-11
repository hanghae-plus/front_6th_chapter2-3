import z from "zod"

export const POST_PAGINATION_LIMIT_OPTION = z.enum(["10", "20", "30"])

export const POST_PAGINATION_LIMIT_OPTIONS = [
  { value: POST_PAGINATION_LIMIT_OPTION.enum[10], label: "10" },
  { value: POST_PAGINATION_LIMIT_OPTION.enum[20], label: "20" },
  { value: POST_PAGINATION_LIMIT_OPTION.enum[30], label: "30" },
]
