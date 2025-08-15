import { PageData } from "@/shared/types"

/**사용자 정보 */
export interface User {
  id: number
  image: string
  username: string
}

/**사용자 목록 응답 */
export interface UsersResponse extends PageData {
  users: User[]
}

export type UserInfo = {
  address: {
    address: string
    city: string
    coordinates: {
      lat: number
      lng: number
    }
    country: string
    postalCode: string
    state: string
    stateCode: string
  }
  age: number
  bank: {
    cardExpire: string
    cardNumber: string
    cardType: string
    currency: string
    iban: string
  }
  birthDate: string
  bloodGroup: string
  company: {
    address: {
      address: string
      city: string
      coordinates: {
        lat: number
        lng: number
      }
      country: string
      postalCode: string
      state: string
      stateCode: string
    }
    department: string
    name: string
    title: string
  }
  crypto: {
    coin: string
    network: string
    wallet: string
  }
  ein: string
  email: string
  eyeColor: string
  firstName: string
  gender: string
  hair: {
    color: string
    type: string
  }
  height: number
  id: number
  image: string
  ip: string
  lastName: string
  macAddress: string
  maidenName: string
  password: string
  phone: string
  role: string
  ssn: string
  university: string
  userAgent: string
  username: string
  weight: number
}
