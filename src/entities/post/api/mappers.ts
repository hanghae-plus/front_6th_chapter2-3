import { UsersResponseDTO } from "../../../shared/api/endpoints/users";
import { PostsResponseDTO, GetPostsRequestDTO } from "../../../shared/api/endpoints/posts";
import { GetUsersRequestDTO } from "../../../shared/api/endpoints/users";
import { GetPostsParams, Posts } from "../model";

export const mapDTOToPostsEntitiy = (postsDto: PostsResponseDTO, usersDto: UsersResponseDTO): Posts => {
  const posts = postsDto.posts.map((post) => {
    const findUser = usersDto.users.find((user) => user.id === post.userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId: _userId, ...restPost } = post;

    return { ...restPost, author: findUser };
  });

  return {
    posts: posts,
    total: postsDto.total,
    limit: postsDto.limit,
    skip: postsDto.skip,
  };
};

export const mapEntityToGetPostsRequestDTO = (
  params: GetPostsParams,
): { posts: GetPostsRequestDTO; users: GetUsersRequestDTO } => {
  return {
    posts: {
      query: {
        limit: params.limit,
        skip: params.skip,
      },
    },
    users: {
      query: {
        limit: params.limit,
        select: params.select,
      },
    },
  };
};
