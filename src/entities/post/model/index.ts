export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  author?: {
    id: number;
    username: string;
    image: string;
  };
}

export interface Posts {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface GetPostsParams {
  limit: number;
  skip: number;
  select: string;
}
