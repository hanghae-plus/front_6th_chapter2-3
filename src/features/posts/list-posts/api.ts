import { fetchPosts } from '../../../entities/post/api/api';
import { Posts } from '../../../entities/post/model/type';
import { fetchUserBasic } from '../../../entities/user/api/api';
import { UserBasic } from '../../../entities/user/types';

export async function fetchPostsWithAuthors(limit: number, skip: string) {
  const [postsData, usersData] = await Promise.all([fetchPosts(limit, skip), fetchUserBasic()]);

  return {
    posts: postsData.posts.map((post: Posts) => ({
      ...post,
      author: usersData.find((user: UserBasic) => user.id === post.userId),
    })),
    total: postsData.total,
  };
}
