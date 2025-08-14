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
    const response = await fetch(finalUrl);
    if (!response.ok) {
      throw new Error(`게시물 조회 실패: ${response.status}`);
    }
    return await response.json();
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

  const response = await fetch(`/api/posts/search?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error('게시물 검색 실패');
  }
  return await response.json();
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
    fetch(`/api/posts/tag/${tag}?${searchParams.toString()}`),
    fetch('/api/users?limit=0&select=username,image'),
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
