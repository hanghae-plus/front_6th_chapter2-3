export interface PaginationParams {
  skip?: number
  limit?: number
}

export const paginateArray = <T>(array: T[], { skip = 0, limit }: PaginationParams): T[] => {
  if (!limit) return array

  const startIndex = skip
  const endIndex = startIndex + limit

  return array.slice(startIndex, endIndex)
}

export const shouldPaginate = (hasFilters: boolean, totalItems: number, limit?: number): boolean => {
  return hasFilters && totalItems > (limit || 0)
}
