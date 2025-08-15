export type PostReaction = {
  likes?: number;
  dislikes?: number;
};

export type PostAuthor = {
  id?: number;
  username?: string;
  image?: string;
};

export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  reactions?: PostReaction;
  author?: PostAuthor;
};
