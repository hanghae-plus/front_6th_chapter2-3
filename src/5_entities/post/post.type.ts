interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  reactions?: PostReactions;
}

interface PostReactions {
  likes: number;
  dislikes: number;
}

export type { Post, PostReactions };
