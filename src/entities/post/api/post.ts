import { GetPostsParams } from "../model";
import { usersRequests } from "../../../shared/api/endpoints/users";
import { postsRequests } from "../../../shared/api/endpoints/posts";
import { mapDTOToPostsEntitiy, mapEntityToGetPostsRequestDTO } from "./mappers";

// 게시물 목록 조회
export const getPosts = async (params: GetPostsParams) => {
  const posts = await postsRequests.getPosts(mapEntityToGetPostsRequestDTO(params).posts);
  const users = await usersRequests.getUsers(mapEntityToGetPostsRequestDTO(params).users);

  const postsWithAuthor = mapDTOToPostsEntitiy(posts, users);

  return postsWithAuthor;
};
