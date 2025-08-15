import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Post, NewPost } from '../../../entities/post';
import { User } from '../../../entities/user';
import * as postAPI from '../../../entities/post/api';
import * as userAPI from '../../../entities/user/api';

// 게시글 목록 조회 (사용자 정보 포함)
export const usePosts = (limit: number, skip: number) => {
  return useQuery({
    queryKey: ['posts', limit, skip],
    queryFn: async () => {
      const [postsData, usersData] = await Promise.all([
        postAPI.fetchPosts(limit, skip),
        userAPI.fetchUsers(),
      ]);

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }));

      return { posts: postsWithUsers, total: postsData.total };
    },
  });
};

// 게시글 검색 (사용자 정보 포함)
export const useSearchPosts = (query: string) => {
  return useQuery({
    queryKey: ['posts', 'search', query],
    queryFn: async () => {
      if (!query) return { posts: [], total: 0 };

      const [postsData, usersData] = await Promise.all([
        postAPI.searchPosts(query),
        userAPI.fetchUsers(),
      ]);

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }));

      return { posts: postsWithUsers, total: postsData.total };
    },
    enabled: !!query,
  });
};

// 태그별 게시글 조회 (사용자 정보 포함)
export const usePostsByTag = (tag: string) => {
  return useQuery({
    queryKey: ['posts', 'tag', tag],
    queryFn: async () => {
      if (!tag || tag === 'all') return { posts: [], total: 0 };

      const [postsData, usersData] = await Promise.all([
        postAPI.fetchPostsByTag(tag),
        userAPI.fetchUsers(),
      ]);

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: User) => user.id === post.userId),
      }));

      return { posts: postsWithUsers, total: postsData.total };
    },
    enabled: !!tag && tag !== 'all',
  });
};

// 게시글 추가
export const useAddPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: NewPost) => {
      const data = await postAPI.addPost(newPost);

      // API 응답에서 ID 확인 및 처리
      let postWithId = data;
      if (!data.id) {
        // ID가 없으면 임시 ID 생성 (서버에서 생성된 ID로 대체될 예정)
        postWithId = {
          ...data,
          id: Date.now(),
        };
      }

      // 새 게시글에 author 정보 추가
      const usersData = await userAPI.fetchUsers();
      const newPostWithAuthor = {
        ...postWithId,
        author: usersData.users.find((user: User) => user.id === postWithId.userId),
      };
      return newPostWithAuthor;
    },
    onSuccess: (newPost) => {
      // 모든 posts 관련 쿼리에 낙관적 업데이트 적용
      const queries = queryClient.getQueriesData({ queryKey: ['posts'], exact: false });
      queries.forEach(([queryKey, data]) => {
        if (data && (data as any).posts) {
          queryClient.setQueryData(queryKey, {
            ...data,
            posts: [newPost, ...(data as any).posts],
            total: (data as any).total + 1,
          });
        }
      });
    },
  });
};

// 게시글 수정
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, post }: { id: number; post: Partial<Post> }) => {
      return await postAPI.updatePost(id, post);
    },
    onSuccess: (updatedPost) => {
      // 모든 posts 관련 쿼리에 낙관적 업데이트 적용
      const queries = queryClient.getQueriesData({ queryKey: ['posts'], exact: false });
      queries.forEach(([queryKey, data]) => {
        if (data && (data as any).posts) {
          const updatedPosts = (data as any).posts.map((p: Post) =>
            p.id === updatedPost.id ? { ...p, ...updatedPost } : p,
          );
          queryClient.setQueryData(queryKey, {
            ...data,
            posts: updatedPosts,
          });
        }
      });
    },
  });
};

// 게시글 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await postAPI.deletePost(id);
    },
    onSuccess: (_, deletedId) => {
      // 모든 posts 관련 쿼리에 낙관적 업데이트 적용
      const queries = queryClient.getQueriesData({ queryKey: ['posts'], exact: false });
      queries.forEach(([queryKey, data]) => {
        if (data && (data as any).posts) {
          const filteredPosts = (data as any).posts.filter((p: Post) => p.id !== deletedId);
          queryClient.setQueryData(queryKey, {
            ...data,
            posts: filteredPosts,
            total: (data as any).total - 1,
          });
        }
      });
    },
  });
};
