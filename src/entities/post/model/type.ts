import { IUserSummary } from '../../user/model/type';

// 게시글 타입
export type IPost = {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  views: number;
  reactions: {
    likes: number;
    dislikes: number;
  };
  author?: IUserSummary;
};

export type IPostTag = {
  name: string;
  slug: string;
  url: string;
};

export type IPosts = {
  limit: number;
  posts: IPost[];
  skip: number;
  total: number;
};

export type IAddPost = Pick<IPost, 'title' | 'body' | 'userId'>;

export type IAddPostResponse = Pick<IPost, 'id' | 'title' | 'body' | 'userId'>;

export type IEditPost = IPost;

export type IEditPostResponse = Omit<IPost, 'views'>;
