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

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  author?: User
}

export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
  user: User
}

export interface Tag {
  url: string
  slug: string
}

export interface NewPost {
  title: string
  body: string
  userId: number
}

export interface NewComment {
  body: string
  postId: number | null
  userId: number
}
