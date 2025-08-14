// http://localhost:5173/api/posts?limit=10&skip=0
import { BasicUser } from '@/shared/model/types.ts';

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}
// http://localhost:5173/api/posts/search?q=all
export interface PostsSearchResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

// http://localhost:5173/api/posts/tag/mystery
export interface PostsTagDetailResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

// http://localhost:5173/api/posts/tags
export type PostsTagsResponse = PostTag[];

// POST http://localhost:5173/api/posts/add
type RequiredPostsAddKey = 'title' | 'body' | 'userId';
export type PostsAddRequest = Pick<Post, RequiredPostsAddKey> &
  Partial<Omit<Post, RequiredPostsAddKey | 'id'>>;

// PUT http://localhost:5173/api/posts/252
type RequiredPutPostsDetailRequestKey = 'title' | 'body' | 'userId' | 'id';
export type PutPostsDetailRequest<
  T extends Pick<Post, RequiredPutPostsDetailRequestKey> &
    Partial<Omit<Post, RequiredPutPostsDetailRequestKey>>,
> = T;

export type PostAuthor = BasicUser;
// DELETE http://localhost:5173/api/posts/252
export type DeletePostsDetailResponse = Pick<Post, 'id'>;

export type PostsAddResponse = Pick<Post, 'id' | 'title' | 'body' | 'userId'>;

export interface PostTag {
  name: string;
  slug: string;
  url: string;
}

export interface Post {
  // 게시글 아이디
  id: number;

  // 게시글 내용
  title: string;
  body: string;

  // 게시글 태그
  tags: PostTag['slug'][];

  // 게시글 반응
  reactions: {
    likes: number;
    dislikes: number;
  };
  author?: PostAuthor;
  // 조회수
  views: number;

  // 작성자 유저 아이디
  userId: number;
}

export interface NewPostAddedRequest {
  newPost: PostsAddRequest;
  setNewPost: (post: PostsAddRequest) => void;
  resetNewPost: () => void;
}

export interface SelectedPost {
  title: string;
  body?: string;
}
