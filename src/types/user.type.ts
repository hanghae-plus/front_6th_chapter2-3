export type User = {
  id: number
  image: string
  username: string
}
export type UserResponse = {
  limit: number
  users: User[]
  skip: number
  total: number
}
