import type { IUser } from '@shared/model'

export interface IAddress {
  address?: string
  city?: string
  state?: string
}

export interface ICompany {
  name?: string
  title?: string
}

export interface IUserDetail extends IUser {
  firstName?: string
  lastName?: string
  age?: number
  email?: string
  phone?: string
  address?: IAddress
  company?: ICompany
}
