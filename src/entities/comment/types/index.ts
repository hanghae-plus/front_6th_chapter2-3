// PostsManagerPage.tsx에서 추론한 Comment 관련 타입 정의들
export interface Comment {
  id: number;
  body: string;
  postId: number | null;
  userId: number;
  likes: number;
  user: {
    username: string;
  };
}

export interface NewComment {
  body: string;
  postId: number | null;
  userId: number;
}
