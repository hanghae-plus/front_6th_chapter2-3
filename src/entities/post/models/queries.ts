import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postsKeys } from "../../../shared/query-keys/post";
import { getPosts, getPostBySearch, getPostByTag, addPost, updatePost, deletePost } from "./api";
import type { PageParams } from "../../../shared/query-keys/post";
import type { Post, PostsResponse } from "./types";

export function usePostsPageQuery(params: PageParams) {
  return useQuery<PostsResponse>({
    queryKey: postsKeys.page(params),
    queryFn: () => getPosts(params),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function usePostsSearchQuery(search: string, enabled = true) {
  return useQuery<PostsResponse>({
    queryKey: postsKeys.search(search),
    queryFn: () => getPostBySearch({ search }),
    enabled: enabled && !!search,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

export function usePostsByTagQuery(tag: string, enabled = true) {
  return useQuery<PostsResponse>({
    queryKey: postsKeys.tag(tag),
    queryFn: () => getPostByTag({ tag }),
    enabled: enabled && !!tag && tag !== "all",
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

function updateAllPostLists(qc: ReturnType<typeof useQueryClient>, updater: (prev: PostsResponse) => PostsResponse) {
  const lists = qc.getQueriesData<PostsResponse>({ queryKey: postsKeys.all });
  lists.forEach(([key, prev]) => {
    if (!prev) return;
    qc.setQueryData<PostsResponse>(key, updater(prev));
  });
}

export function useAddPostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ post }: { post: Partial<Post> }) => addPost({ post }),
    onSuccess: (created) => {
      updateAllPostLists(qc, (prev) => ({
        ...prev,
        posts: [created as Post, ...(prev.posts ?? [])],
        total: (prev.total ?? 0) + 1,
      }));
    },
  });
}

export function useUpdatePostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ post }: { post: Post }) => updatePost({ post }),
    onSuccess: (updated) => {
      updateAllPostLists(qc, (prev) => ({
        ...prev,
        posts: (prev.posts ?? []).map((p) => (p.id === (updated as Post).id ? (updated as Post) : p)),
      }));
      qc.setQueryData(postsKeys.detail((updated as Post).id), updated);
    },
  });
}

export function useDeletePostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deletePost({ id }),
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: postsKeys.all });
      const snapshots = qc.getQueriesData<PostsResponse>({ queryKey: postsKeys.all });
      snapshots.forEach(([key, prev]) => {
        if (!prev) return;
        qc.setQueryData<PostsResponse>(key, {
          ...prev,
          posts: (prev.posts ?? []).filter((p) => p.id !== id),
          total: Math.max(0, (prev.total ?? 0) - 1),
        });
      });
      return { snapshots };
    },
    onError: (_e, _v, ctx) => {
      ctx?.snapshots?.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => {},
  });
}
