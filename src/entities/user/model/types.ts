// 사용자 도메인 타입 정의

export interface User {
  id: number
  username: string
  image: string
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
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

// API 응답 타입
export interface UsersApiResponse {
  users: User[]
}
