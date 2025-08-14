// TODO: 추후 타입 보강.. 일단 보이는 것만 적음..
export interface PostType {
  id: number;
  title: string;
  tags: string[];
  author?: {
    image: string;
    username: string;
  };
  reactions: {
    likes: number;
    dislikes: number;
  };
}

export interface GetPostsListResponseType {
  posts: PostType[];
  total: number;
}

export interface PostPostRequestType {
  title: string;
  body: string;
  userId: number;
}

export interface PutPostRequestType {
  title: string;
  body: string;
  userId: number;
  id: number;
}
