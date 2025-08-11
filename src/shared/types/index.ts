export interface Author {
  id: number
  username: string
  image: string
}

export interface Pagination {
  limit: number
  skip: number
  total: number
}