// 사용자 정보 타입 정의

export interface UserAddress {
  address: string
  city: string
  state: string
}

export interface UserCompany {
  name: string
  title: string
}

export interface User {
  id: number
  username: string
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
  image: string
  address?: UserAddress
  company?: UserCompany
}

// selectedUser 타입
export type SelectedUser = User | null
