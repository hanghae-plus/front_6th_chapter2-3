export type PaginatedResponse<T, K extends string = "data"> = {
  [key in K]: T[]
} & {
  total: number
  skip: number
  limit: number
}

export type DeleteResponse<T> = T & {
  isDeleted: number
  deletedOn: string
}
