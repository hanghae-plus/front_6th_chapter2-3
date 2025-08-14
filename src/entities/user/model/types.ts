
export interface User {
  id: number
  username: string
  image?: string | null
}
// TODO UserModal 부분
export interface UserWithInfo extends User {
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
}