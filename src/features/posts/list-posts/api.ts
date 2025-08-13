import { fetchPosts } from '../../../entities/post/api/api';
import { Posts } from '../../../entities/post/model/type';
import { fetchUserBasic } from '../../../entities/user/api/api';
import { UserBasic } from '../../../entities/user/model/type';

export async function fetchPostsWithAuthors(limit: number, skip: string) {
  const [postsData, usersResponse] = await Promise.all([fetchPosts(limit, skip), fetchUserBasic()]);

  return {
    posts: postsData.posts.map((post: Posts) => ({
      ...post,
      author: usersResponse.users.find((user: UserBasic) => user.id === post.userId),
    })),
    total: postsData.total,
  };
}
