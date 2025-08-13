export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  reactions?: PostReactions;
}

export interface PostWithAuthor extends Post {
  author?: PostAuthor;
}

export interface PostAuthor {
  image: string;
  username: string;
}

export interface PostReactions {
  likes: number;
  dislikes: number;
}
