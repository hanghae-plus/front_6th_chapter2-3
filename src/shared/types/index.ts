export interface originPost {
  body: string
  id: number
  reactions: Reactions
  tags: Array<String>
  title: string
  userId: number
  views: number
}

export interface Post extends originPost {
  author: Author
}

export interface Author {
  id: number
  username: string
  image: string
}

export interface Reactions {
  likes: number
  dislikes: number
}

export interface Pagination {
  limit: number
  skip: number
  total: number
}

export interface NewComment {
  body: string
  postId: number | null
  userId: number
}

export interface Comment {
  id: number
  body: string
  postId: number
  likes: number
  user: {
    id: number
    username: string
    fullName: string
  }
}

export type Posts = Pagination & { posts: Array<originPost> }
export type Users = Pagination & { users: Array<Author> }
export type Comments = Pagination & { comments: Array<Comment> }

export interface User {
  id: number
  firstName: string
  lastName: string
  maidenName: string
  age: number
  gender: string
  email: string
  phone: string
  username: string
  password: string
  birthDate: string
  image: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  hair: {
    color: string
    type: string
  }
  ip: string
  address: {
    address: string
    city: string
    state: string
    stateCode: string
    postalCode: string
    coordinates: {
      lat: number
      lng: number
    }
    country: string
  }
  macAddress: string
  university: string
  bank: {
    cardExpire: string
    cardNumber: string
    cardType: string
    currency: string
    iban: string
  }
  company: {
    department: string
    name: string
    title: string
    address: {
      address: string
      city: string
      state: string
      stateCode: string
      postalCode: string
      coordinates: {
        lat: number
        lng: number
      }
      country: string
    }
  }
  ein: string
  ssn: string
  userAgent: string
  crypto: {
    coin: string
    wallet: string
    network: string
  }
  role: string
}

export interface Tag {
  slug: string
  name: string
  url: string
}
