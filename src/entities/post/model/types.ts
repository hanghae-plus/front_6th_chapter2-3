import { User } from '@/entities/user/model/types';

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
  views: number;
  author?: User;
}

export interface Tag {
  slug: string;
  name: string;
  url: string;
}

export type NewPostPayload = Omit<Post, 'id' | 'reactions' | 'author' | 'tags' | 'views'>;
