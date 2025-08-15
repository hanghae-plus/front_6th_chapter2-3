export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  reactions?: {
    likes: number;
    dislikes: number;
  };
  author?: any;
}

export interface CreatePost {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePost {
  title: string;
  body: string;
}

export interface Tag {
  url: string;
  slug: string;
}
