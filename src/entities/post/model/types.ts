export type UserLite = {
  id: number;
  username: string;
  image?: string;
};

export type Address = { address?: string; city?: string; state?: string };

export type Company = { name?: string; title?: string };

export type User = UserLite & {
  firstName?: string;
  lastName?: string;
  age?: number;
  email?: string;
  phone?: string;
  address?: Address;
  company?: Company;
};

export type Reactions = {
  likes: number;
  dislikes: number;
};

export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  reactions?: Reactions;
  author?: UserLite;
};

export type NewPost = { title: string; body: string; userId: number };

export type Tag = { slug: string; url: string };

export type Comment = {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: UserLite;
};

export type NewComment = { body: string; postId: number | null; userId: number };
