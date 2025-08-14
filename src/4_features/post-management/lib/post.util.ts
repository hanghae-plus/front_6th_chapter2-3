import type { Post } from '@/entities/post';
import type { User, UserPick } from '@/entities/user';

import { PostWithAuthor } from '../types';

export const getPostsWithAuthor = <K extends keyof User>(
  posts: Post[],
  users: UserPick<K | 'id'>[]
): PostWithAuthor<K>[] => {
  return posts.map(post => {
    const author = users.find(user => user.id === post.userId);

    return {
      ...post,
      author,
    };
  });
};
