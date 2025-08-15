export interface CreateCommentsRequest {
  body: string
  postId: number | null
  userId: number
}

export interface CreateCommentsResponse {
  body: string
  id: number
  postId: number
  user: { id: number; username: string; fullName: string }
}

export interface UpdateCommentsResponse extends CreateCommentsResponse {
  likes: number
}

export interface UpdateCommentsLikesRequest {
  likes: number
}

export interface UpdateCommentsLikesResponse extends CreateCommentsResponse {
  likes: number
}
