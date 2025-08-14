import type { Post } from '@/entities/post';
import type { User, UserPick } from '@/entities/user';

export interface PostWithAuthor<K extends keyof User> extends Post {
  author?: UserPick<K>;
}
