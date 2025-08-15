export interface User {
  id: number
  username: string
  image: string
  email?: string
  firstName?: string
  lastName?: string
  age?: number
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