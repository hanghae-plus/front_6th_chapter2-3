import type { SortOrder } from "./sort"

export type PaginationParams = {
  limit?: number
  skip?: number
  sortBy?: string
  order?: SortOrder
}
