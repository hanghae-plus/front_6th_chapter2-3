export interface Posts {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

export interface PostsState {
  posts: Posts[];
  total: number;
  loading: boolean;
  setPosts: (posts: Posts[]) => void;
  fetchPosts: (limit: number, skip: string) => Promise<void>;
}
