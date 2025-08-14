export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  author?: UserSummary;
}

export interface PostsApiResponse {
    posts: Post[];
    total: number;
    skip: number;
    limit: number;
}

export interface Comment {
    id: number;
    body: string;
    postId: number;
    likes: number;
    user: {
        id: number;
        username: string;
    }
}

export interface CommentsApiResponse {
    comments: Comment[];
    total: number;
    skip: number;
    limit: number;
}

export interface Tag {
    slug: string;
    name: string;
    url: string;
}

export interface UserSummary {
    id: number;
    username: string;
    image: string;
}

export interface UserDetails extends UserSummary {
    firstName: string;
    lastName:string;
    age: number;
    email: string;
    phone: string;
    address: {
        address: string;
        city: string;
        state: string;
    };
    company: {
        name: string;
        title: string;
    };
}
