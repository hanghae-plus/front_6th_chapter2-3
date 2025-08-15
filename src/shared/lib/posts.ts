import type { Post, UserLite } from '../../entities/post/model/types';

export function attachAuthor(posts: Post[], users: UserLite[]) {
  return posts.map((post) => ({
    ...post,
    author: users.find((u) => u.id === post.userId),
  }));
}
