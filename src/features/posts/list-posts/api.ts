import { fetchPosts } from '../../../entities/post/model/api';
import { Posts } from '../../../entities/post/model/type';
import { fetchUserBasic } from '../../../entities/user/model/api';
import { UserBasic } from '../../../entities/user/model/type';

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
