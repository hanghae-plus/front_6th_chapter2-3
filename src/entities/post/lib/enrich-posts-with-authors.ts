import { client } from '@/shared/configs';
import type { Post } from '../model/types';
import type { User } from '@/entities/user/model/types';

/**
 * Post 배열에 author 정보를 추가하는 유틸리티 함수
 */
export async function enrichPostsWithAuthors(posts: Post[]): Promise<Post[]> {
  if (!posts || posts.length === 0) {
    return posts;
  }

  return Promise.all(
    posts.map(async (post): Promise<Post> => {
      try {
        const user = await client.get<User>(`/users/${post.userId}`);
        return {
          ...post,
          author: {
            id: user.id,
            username: user.username,
            image: user.image,
          },
        };
      } catch (error) {
        return {
          ...post,
          author: {
            id: post.userId,
            username: `User ${post.userId}`,
            image: `https://robohash.org/${post.userId}?size=32x32`,
          },
        };
      }
    }),
  );
}

/**
 * 단일 Post에 author 정보를 추가하는 함수
 */
export async function enrichPostWithAuthor(post: Post): Promise<Post> {
  const [enrichedPost] = await enrichPostsWithAuthors([post]);
  return enrichedPost;
}
