import { httpClient } from '../../../../shared/config/httpClient';
import { fetchUserBasic } from '../../../../entities/user/api/api';
import { FilterApiParams } from '../model/type';

export const fetchFilteredPosts = async (params: FilterApiParams) => {
  const { limit, skip, search, sortBy, sortOrder, tag } = params;

  const searchParams = new URLSearchParams({
    limit: limit.toString(),
    skip: skip.toString(),
  });

  if (sortBy && sortBy !== 'none') {
    searchParams.append('sortBy', sortBy);
  }

  if (sortOrder) {
    searchParams.append('sortOrder', sortOrder);
  }

  let apiUrl = '/api/posts';

  if (tag && tag !== 'all') {
    apiUrl = `/api/posts/tag/${tag}`;
  } else if (search && search.trim()) {
    apiUrl = `/api/posts/search`;
    searchParams.append('q', search.trim());
  }

  const finalUrl = `${apiUrl}?${searchParams.toString()}`;

  try {
    const [postsResponse, usersResponse] = await Promise.all([
      httpClient.get(finalUrl),
      fetchUserBasic(),
    ]);

    if (!postsResponse.ok) {
      throw new Error(`게시물 조회 실패: ${postsResponse.status}`);
    }

    const postsData = await postsResponse.json();

    return {
      posts: postsData.posts.map((post: any) => ({
        ...post,
        author: usersResponse.users.find((user: any) => user.id === post.userId),
      })),
      total: postsData.total,
    };
  } catch (error) {
    console.error('필터링된 게시물 조회 오류:', error);
    throw error;
  }
};

export const searchPosts = async (query: string, limit: number, skip: number) => {
  const searchParams = new URLSearchParams({
    q: query,
    limit: limit.toString(),
    skip: skip.toString(),
  });

  const response = await httpClient.get(`/api/posts/search?${searchParams.toString()}`);
  if (!response.ok) throw new Error('게시물 검색 실패');
  return response.json();
};
export const fetchPostsByTag = async (
  tag: string,
  limit: number,
  skip: number,
  sortBy?: string,
  sortOrder?: string,
) => {
  const searchParams = new URLSearchParams({
    limit: limit.toString(),
    skip: skip.toString(),
  });

  if (sortBy && sortBy !== 'none') {
    searchParams.append('sortBy', sortBy);
  }

  if (sortOrder) {
    searchParams.append('sortOrder', sortOrder);
  }

  const [postsResponse, usersResponse] = await Promise.all([
    httpClient.get(`/api/posts/tag/${tag}?${searchParams.toString()}`),
    httpClient.get('/api/users?limit=0&select=username,image'),
  ]);

  if (!postsResponse.ok || !usersResponse.ok) {
    throw new Error('태그별 게시물 조회 실패');
  }

  const postsData = await postsResponse.json();
  const usersData = await usersResponse.json();

  return {
    posts: postsData.posts.map((post: any) => ({
      ...post,
      author: usersData.users.find((user: any) => user.id === post.userId),
    })),
    total: postsData.total,
  };
};
