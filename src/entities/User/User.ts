export interface UserResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export interface User {
  id: number
  username: string
  image: string
}
