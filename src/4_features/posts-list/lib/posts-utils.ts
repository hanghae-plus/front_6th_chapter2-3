import type { Post } from '@/entities/post';
import type { User } from '@/entities/user';
import type { PostWithAuthor } from '@/features/posts-list';

export const getPostsWithAuthor = (
  posts: Post[],
  users: User[]
): PostWithAuthor[] => {
  return posts.map(post => ({
    ...post,
    author: users.find(user => user.id === post.userId),
  }));
};
