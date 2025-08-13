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

export type DetailedUser = User & {
  firstName?: string
  lastName?: string
  age?: number
  email?: string
  phone?: string
  address?: {
    address: string
    city: string
    state: string
  }
  company?: {
    name: string
    title: string
  }
}
