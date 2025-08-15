import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postApi } from "./postApi";
import { userApi } from "@/entities/user/api/userApi";
import { postQueryKeys } from "./queryKeys";
import {
  GetPostsRequestType,
  PostPostRequestType,
  PutPostRequestType,
  PostType,
} from "@/entities/post/model/types";
import { UserType } from "@/entities/user/model/types";

// 게시물과 사용자 정보 결합
const combinePostsWithUsers = (
  posts: PostType[],
  users: UserType[],
): PostType[] => {
  return posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.userId),
  }));
};

// 게시물 정렬
const sortPosts = (
  posts: PostType[],
  sortBy: string,
  sortOrder: "asc" | "desc",
): PostType[] => {
  if (!sortBy || sortBy === "none") return posts;

  return [...posts].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortBy) {
      case "id":
        aValue = a.id;
        bValue = b.id;
        break;
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "reactions":
        aValue = (a.reactions?.likes || 0) + (a.reactions?.dislikes || 0);
        bValue = (b.reactions?.likes || 0) + (b.reactions?.dislikes || 0);
        break;
      default:
        return 0;
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

// 게시물 목록 조회 (사용자 정보 포함)
export const useGetPostsQuery = (
  params: GetPostsRequestType & { sortBy?: string; sortOrder?: "asc" | "desc" },
) => {
  const { sortBy = "", sortOrder = "asc", ...postParams } = params;

  return useQuery({
    queryKey: postQueryKeys.list({ ...postParams, sortBy, sortOrder }),
    queryFn: async () => {
      const [postsData, usersData] = await Promise.all([
        postApi.getPosts(postParams.limit, postParams.skip),
        userApi.getUsers(),
      ]);

      const postsWithUsers = combinePostsWithUsers(
        postsData.posts,
        usersData.users,
      );
      const sortedPosts = sortPosts(postsWithUsers, sortBy, sortOrder);

      return {
        posts: sortedPosts,
        total: postsData.total,
      };
    },
  });
};

// 게시물 검색 조회 (사용자 정보 포함)
export const useGetSearchPostsQuery = (
  searchQuery: string,
  sortBy: string,
  sortOrder: "asc" | "desc",
  params?: { limit?: number; skip?: number },
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: postQueryKeys.search(searchQuery, {
      ...params,
      sortBy,
      sortOrder,
    }),
    queryFn: async () => {
      const [postsData, usersData] = await Promise.all([
        postApi.searchPosts(searchQuery),
        userApi.getUsers(),
      ]);

      const postsWithUsers = combinePostsWithUsers(
        postsData.posts,
        usersData.users,
      );
      const sortedPosts = sortPosts(postsWithUsers, sortBy, sortOrder);

      // 페이지네이션 적용
      const startIndex = params?.skip || 0;
      const endIndex = startIndex + (params?.limit || 10);
      const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

      return {
        posts: paginatedPosts,
        total: sortedPosts.length, // 검색 결과의 실제 개수 사용
      };
    },
    enabled: options?.enabled ?? !!searchQuery,
  });
};

// 게시물 태그 조회 (사용자 정보 포함)
export const useGetPostsByTagQuery = (
  tag: string,
  sortBy: string,
  sortOrder: "asc" | "desc",
  params?: { limit?: number; skip?: number },
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: postQueryKeys.byTag(tag, { ...params, sortBy, sortOrder }),
    queryFn: async () => {
      if (!tag || tag === "all") {
        const [postsData, usersData] = await Promise.all([
          postApi.getPosts(params?.limit || 10, params?.skip || 0),
          userApi.getUsers(),
        ]);

        const postsWithUsers = combinePostsWithUsers(
          postsData.posts,
          usersData.users,
        );
        const sortedPosts = sortPosts(postsWithUsers, sortBy, sortOrder);

        return {
          posts: sortedPosts,
          total: postsData.total,
        };
      }

      const [postsData, usersData] = await Promise.all([
        postApi.getPostsByTag(tag),
        userApi.getUsers(),
      ]);

      const postsWithUsers = combinePostsWithUsers(
        postsData.posts,
        usersData.users,
      );
      const sortedPosts = sortPosts(postsWithUsers, sortBy, sortOrder);

      // 페이지네이션 적용
      const startIndex = params?.skip || 0;
      const endIndex = startIndex + (params?.limit || 10);
      const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

      return {
        posts: paginatedPosts,
        total: sortedPosts.length, // 필터링된 결과의 실제 개수 사용
      };
    },
    enabled: options?.enabled ?? true,
  });
};

// 태그 목록 조회
export const useGetTagsQuery = () => {
  return useQuery({
    queryKey: postQueryKeys.tags(),
    queryFn: () => postApi.getTags(),
  });
};

// 게시물 추가
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PostPostRequestType) => postApi.addPost(req),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: postQueryKeys.all });

      const previousData = queryClient.getQueriesData({
        queryKey: postQueryKeys.all,
      });

      const optimisticId = `optimistic_${Date.now()}`;

      queryClient.setQueriesData(
        { queryKey: postQueryKeys.all },
        (oldData: { posts: PostType[]; total: number } | undefined) => {
          if (!oldData || !Array.isArray(oldData.posts)) {
            return oldData;
          }

          // 임시 ID로 새 게시물 생성 (서버에서 실제 ID를 받으면 교체됨)
          const optimisticPost: PostType = {
            id: optimisticId as unknown as number,
            title: newPost.title,
            body: newPost.body,
            userId: newPost.userId,
            views: 0,
            reactions: { likes: 0, dislikes: 0 },
            tags: [],
            author: undefined, // 나중에 서버에서 받은 데이터로 교체
          };

          return {
            ...oldData,
            posts: [optimisticPost, ...oldData.posts],
            total: oldData.total + 1,
          };
        },
      );

      return { previousData, optimisticId };
    },
    onError: (err, _newPost, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error("게시물 추가 실패:", err);
    },
    onSuccess: async (addedPost, _variables, context) => {
      if (!context?.optimisticId) {
        queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
        return;
      }

      try {
        const usersData = await userApi.getUsers();
        const author = usersData.users.find(
          (user) => user.id === addedPost.userId,
        );

        const completePost: PostType = {
          ...addedPost,
          views: 0,
          reactions: { likes: 0, dislikes: 0 },
          tags: [],
          author,
        };

        queryClient.setQueriesData(
          { queryKey: postQueryKeys.all },
          (oldData: { posts: PostType[]; total: number } | undefined) => {
            if (!oldData || !Array.isArray(oldData.posts)) {
              return oldData;
            }

            return {
              ...oldData,
              posts: oldData.posts.map((post: PostType) =>
                String(post.id) === context.optimisticId ? completePost : post,
              ),
            };
          },
        );
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
        queryClient.setQueriesData(
          { queryKey: postQueryKeys.all },
          (oldData: { posts: PostType[]; total: number } | undefined) => {
            if (!oldData || !Array.isArray(oldData.posts)) {
              return oldData;
            }

            return {
              ...oldData,
              posts: oldData.posts.map((post: PostType) =>
                String(post.id) === context.optimisticId ? addedPost : post,
              ),
            };
          },
        );
      }
    },
  });
};

// 게시물 수정
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PutPostRequestType) => postApi.updatePost(req.id, req),
    onMutate: async (updatedPost) => {
      await queryClient.cancelQueries({ queryKey: postQueryKeys.all });

      const previousData = queryClient.getQueriesData({
        queryKey: postQueryKeys.all,
      });

      // 낙관적 업데이트 - 즉시 UI에 반영
      queryClient.setQueriesData(
        { queryKey: postQueryKeys.all },
        (oldData: { posts: PostType[]; total: number } | undefined) => {
          if (!oldData || !Array.isArray(oldData.posts)) {
            return oldData;
          }

          return {
            ...oldData,
            posts: oldData.posts.map((post: PostType) =>
              post.id === updatedPost.id ? updatedPost : post,
            ),
          };
        },
      );

      return { previousData };
    },
    onError: (err) => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
      console.error("게시물 수정 실패:", err);
    },
    onSuccess: (updatedPost) => {
      console.log("게시물 수정 성공:", updatedPost);
    },
  });
};

// 게시물 삭제
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: postQueryKeys.all });

      const previousData = queryClient.getQueriesData({
        queryKey: postQueryKeys.all,
      });

      // 낙관적 업데이트 - 즉시 UI에서 게시물 제거
      queryClient.setQueriesData(
        { queryKey: postQueryKeys.all },
        (oldData: { posts: PostType[]; total: number } | undefined) => {
          if (!oldData || !Array.isArray(oldData.posts)) {
            return oldData;
          }

          return {
            ...oldData,
            posts: oldData.posts.filter(
              (post: PostType) => post.id !== deletedId,
            ),
            total: oldData.total - 1,
          };
        },
      );

      return { previousData, deletedId };
    },
    onError: (err, _deletedId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error("게시물 삭제 실패:", err);
    },
    onSuccess: (_, deletedId) => {
      console.log("게시물 삭제 성공:", deletedId);
    },
  });
};
