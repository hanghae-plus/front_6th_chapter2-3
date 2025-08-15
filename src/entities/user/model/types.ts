export interface User {
  address?: Address
  age?: number
  company?: Company
  email?: string
  firstName?: string
  id: number
  image?: string
  lastName?: string
  phone?: string
  username?: string
}

export interface UserQueryParams {
  limit: number
  select: string
}

export interface UsersResponse {
  limit: number
  skip: number
  total: number
  users: User[]
}

interface Address {
  address?: string
  city?: string
  state?: string
}

interface Company {
  name?: string
  title?: string
}
