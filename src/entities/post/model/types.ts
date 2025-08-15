// 게시물 타입
export interface PostsType {
  posts: PostType[];
  limit: number;
  skip: number;
  total: number;
}

export interface PostType {
  id: number;
  title: string;
  body: string;
  userId: number;
  views: number;
  reactions: {
    dislikes: number;
    likes: number;
  };
  author?: PostUserType;
  tags: string[];
}

export interface PostUserType {
  id: number;
  username: string;
  image: string;
}

// 태그 타입
export interface TagType {
  name: string;
  slug: string;
  url: string;
}

// 게시물 목록 조회
export interface GetPostsRequestType {
  limit: number;
  skip: number;
}
export type GetPostsResponseType = PostsType;

// 게시물 추가
export interface PostPostRequestType {
  title: string;
  body: string;
  userId: number;
}
export interface PostPostResponseType {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// 게시물 수정
export type PutPostRequestType = PostType;
export type PutPostResponseType = Omit<PostType, "author" | "views">;
