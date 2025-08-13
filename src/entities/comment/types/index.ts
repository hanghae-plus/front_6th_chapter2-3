export interface Comment {
  id: number;
  body: string;
  postId: number;
  userId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    image: string;
  };
}

export interface NewComment {
  body: string;
  postId: number | null;
  userId: number;
}

export interface CommentsResponse {
  comments: Comment[];
}
