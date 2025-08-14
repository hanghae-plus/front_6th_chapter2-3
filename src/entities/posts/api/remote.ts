import type {
  AddPostCommentResponse,
  AddPostRequest,
  AddPostResponse,
  Post,
  PostCommentsResponse,
  PostsResponse,
  PostsTagsResponse,
  UpdatePostCommentRequest,
  UpdatePostCommentResponse,
} from '../model';
import { remote } from '@/shared/api';

export const getPosts = async (
  limit: number,
  skip: number,
  searchQuery: string,
  selectedTag: string,
  sortBy: string,
  sortOrder: string,
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
      posts: data.posts
        .sort((a, b) => {
          const aReactions = a.reactions.likes + a.reactions.dislikes;
          const bReactions = b.reactions.likes + b.reactions.dislikes;

          return sortOrder === 'asc'
            ? aReactions - bReactions
            : bReactions - aReactions;
        })
        .slice(skip, skip + limit),
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
    searchQuery: string,
    selectedTag: string,
    sortBy: string,
    sortOrder: string,
  ) {
    if (searchQuery) {
      return await remote(
        `/api/posts/search?q=${searchQuery}&limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${sortOrder}`,
      );
    }

    if (selectedTag && selectedTag !== 'all') {
      return await remote(
        `/api/posts/tag/${selectedTag}?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${sortOrder}`,
      );
    }

    return await remote(
      `/api/posts?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${sortOrder}`,
    );
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

export const patchPostCommentLike = async (
  commentId: number,
  likes: number,
) => {
  return await remote(`/api/comments/${commentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes }),
  });
};

export const deletePostComment = async (commentId: number) => {
  return await remote(`/api/comments/${commentId}`, {
    method: 'DELETE',
  });
};

export const addPostComment = async (
  postId: number,
  userId: number,
  body: string,
): Promise<AddPostCommentResponse> => {
  return await remote('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body, postId, userId }),
  });
};

export const updatePostComment = async (
  commentId: number,
  commentData: UpdatePostCommentRequest,
): Promise<UpdatePostCommentResponse> => {
  return await remote(`/api/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData),
  });
};

export const updatePost = async (postId: number, post: Post): Promise<Post> => {
  return await remote(`/api/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
};

export const deletePost = async (postId: number) => {
  return await remote(`/api/posts/${postId}`, {
    method: 'DELETE',
  });
};

export const addPost = async (
  postData: AddPostRequest,
): Promise<AddPostResponse> => {
  return await remote('/api/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
};
