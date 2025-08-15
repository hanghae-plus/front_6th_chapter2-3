export interface UserSummary {
  id: number
  username: string
  image: string
}

export interface UserDetails extends UserSummary {
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
