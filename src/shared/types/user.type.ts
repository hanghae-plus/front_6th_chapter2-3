import { PaginatedResponse } from "../api/type"

// User 인터페이스
export interface User {
  id: number
  username: string
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
  image: string
  address: {
    address: string
    city: string
    state: string
  }
  company: {
    name: string
    title: string
  }
}

// 간단한 User 인터페이스 (Post 목록에서 사용)
export interface Author {
  id: number
  username: string
  image: string
}

export interface UserPaginatedResponse extends PaginatedResponse {
  users: User[]
}
