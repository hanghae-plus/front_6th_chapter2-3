import type { Post } from '@/entities/post';
import type { User } from '@/entities/user';

interface PostWithAuthor extends Post {
  author?: User;
}

export type { PostWithAuthor };
