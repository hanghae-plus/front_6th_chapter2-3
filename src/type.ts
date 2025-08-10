// 게시글
export type IPost = {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  views: number
  reactions: {
    likes: number
    dislikes: number
  }
  author?: IUserSummary
}

export type IAddPost = Pick<IPost, "title" | "body" | "userId">

export type IEditPost = Omit<IPost, "views">

export type IPosts = {
  limit: number
  posts: IPost[]
  skip: number
  total: number
}

// 태그
export type ITag = {
  name: string
  slug: string
  url: string
}

// 댓글
export type IComment = {
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

export type IAddComment = {
  userId: number
  postId: number | null
  body: string
}

export type IEditComment = IComment

export type IComments = {
  comments: IComment[]
  total: string
  skip: number
  limit: number
}

export type ICommentsByPostId = {
  [postId: number]: IComment[]
}

// 유저
export type ICoordinates = {
  lat: number
  lng: number
}

export type IAddress = {
  address: string
  city: string
  state: string
  stateCode: string
  country: string
  postalCode: string
  coordinates: ICoordinates
}

export type IBank = {
  cardExpire: string
  cardNumber: string
  cardType: string
  currency: string
  iban: string
}

export type ICompanyAddress = {
  address: string
  city: string
  state: string
  stateCode: string
  country: string
  postalCode: string
  coordinates: ICoordinates
}

export type ICompany = {
  department: string
  name: string
  title: string
  address: ICompanyAddress
}

export type ICrypto = {
  coin: string
  wallet: string
  network: string
}

export type IHair = {
  color: string
  type: string
}

export type IUserDetail = {
  id: number
  firstName: string
  lastName: string
  maidenName: string
  age: number
  gender: "male" | "female"
  email: string
  username: string
  password: string
  phone: string
  birthDate: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  image: string
  role: "admin" | "user"
  ip: string
  macAddress: string
  university: string
  userAgent: string
  ssn: string
  ein: string
  address: IAddress
  bank: IBank
  company: ICompany
  crypto: ICrypto
  hair: IHair
}

export type IUserSummary = {
  id: number
  username: string
  image: string
}

export type IUsers = {
  limit: number
  skip: number
  total: number
  users: IUserSummary[]
}
