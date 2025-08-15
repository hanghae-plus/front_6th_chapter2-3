export interface Author {
  id: number
  username: string
  image: string
}

export interface PaginationInfo {
  limit: number
  skip: number
  total: number
}
