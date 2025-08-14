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
  author?: {
    id: number;
    username: string;
    image: string;
  };
}

export interface PostsState {
  posts: Posts[];
  total: number;
  loading: boolean;
  setPosts: (posts: Posts[]) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;
  fetchPosts: (limit: number, skip: string) => Promise<void>;
  selectedPost: Posts | null;
  setSelectedPost: (post: Posts | null) => void;
  removePost: (id: number) => void;
}
