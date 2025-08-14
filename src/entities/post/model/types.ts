export type PostReaction = {
  likes?: number;
  dislikes?: number;
};

export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  reactions?: PostReaction;
};
