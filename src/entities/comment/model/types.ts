export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  user: {
    id: number
    username: string
  }
  likes: number
}

export interface Comments {
  comments: Comment[]
  limit: number
  skip: number
  total: number
}

export interface NewCommentDraft {
  body: string;
  postId: number | null;
  userId: number;
}

export interface CommentsResponse {
  comments: Comment[];
  limit: number;
  skip: number;
  total: number;
}

export interface UpdateCommentRequest {
  body: string;
}