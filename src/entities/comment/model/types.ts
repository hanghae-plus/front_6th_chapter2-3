// Comment 관련 타입 정의
export interface Comment {
  id: number;
  body: string;
  postId: number;
  userId: number;
  likes: number;
  user: {
    username: string;
  };
}

export interface CreateComment {
  body: string;
  postId: number | null;
  userId: number;
}

export interface UpdateComment {
  body: string;
}
