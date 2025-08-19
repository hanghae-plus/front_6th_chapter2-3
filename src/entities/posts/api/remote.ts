import type {
  PostCommentsResponse,
  PostsResponse,
  PostsTagsResponse,
  PostSortBy,
  SortOrder,
} from '../model';
import { sortPostsByReactions, slicePosts } from '../model/lib';
import { remote } from '@/shared/api';

export const getPosts = async (
  limit: number,
  skip: number,
  searchQuery: string,
  selectedTag: string,
  sortBy: PostSortBy,
  sortOrder: SortOrder,
): Promise<PostsResponse> => {
  if ('reactions' === sortBy) {
    const data: PostsResponse = await remotePosts(
      0,
      0,
      searchQuery,
      selectedTag,
      'none',
      sortOrder,
    );

    return {
      ...data,
      limit,
      skip,
      posts: slicePosts(
        sortPostsByReactions(data.posts, sortOrder),
        skip,
        limit,
      ),
    };
  }

  return await remotePosts(
    limit,
    skip,
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
  );

  async function remotePosts(
    limit: number,
    skip: number,
    q: string,
    selectedTag: string,
    sortBy: PostSortBy,
    order: SortOrder,
  ) {
    const options = {
      params: {
        q,
        limit,
        skip,
        sortBy,
        order,
      },
    };

    if (q) {
      return await remote(`/api/posts/search`, options);
    }

    if (selectedTag && selectedTag !== 'all') {
      return await remote(`/api/posts/tag/${selectedTag}`, options);
    }

    return await remote(`/api/posts`, options);
  }
};

export const getPostsTags = async (): Promise<PostsTagsResponse> => {
  return await remote('/api/posts/tags');
};

export const getPostComments = async (
  postId: number,
): Promise<PostCommentsResponse> => {
  return await remote(`/api/comments/post/${postId}`);
};
