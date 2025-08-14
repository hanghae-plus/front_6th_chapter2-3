import { useMemo, useEffect } from "react";
import type { Post } from "../../../entities/post/models/types";

import {
  usePostsPageQuery,
  usePostsSearchQuery,
  usePostsByTagQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "../../../entities/post/models/queries";

import { useUsersQuery } from "../../../entities/user/models/queries";

export function usePosts({
  limit,
  skip,
  selectedTag,
  searchQuery,
  sortBy,
  sortOrder,
  newPost,
  selectedPost,
  updateURL,
  setNewPost,
  setShowAddDialog,
  setShowEditDialog,
}: {
  limit: number;
  skip: number;
  selectedTag: string;
  searchQuery: string;
  newPost: Partial<Post>;
  selectedPost: Post | null;
  sortBy: string;
  sortOrder: string;
  updateURL: () => void;
  setNewPost: (post: Partial<Post>) => void;
  setShowAddDialog: (show: boolean) => void;
  setShowEditDialog: (show: boolean) => void;
}) {
  const pageQ = usePostsPageQuery({ skip, limit });
  const searchQ = usePostsSearchQuery(searchQuery, !!searchQuery);
  const tagQ = usePostsByTagQuery(selectedTag, !!selectedTag && selectedTag !== "all");
  const usersQ = useUsersQuery();

  const active = searchQuery ? searchQ : selectedTag && selectedTag !== "all" ? tagQ : pageQ;

  const posts = useMemo(() => {
    const raw = active.data?.posts ?? [];
    const users = usersQ.data?.users ?? [];
    if (!users.length) return raw;
    return raw.map((p) => ({
      ...p,
      author: users.find((u) => u.id === p.userId),
    }));
  }, [active.data, usersQ.data]);

  const total = active.data?.total ?? 0;
  const loading = active.isPending || usersQ.isPending;

  const addMutation = useAddPostMutation();
  const updateMutation = useUpdatePostMutation();
  const deleteMutation = useDeletePostMutation();

  const handleAddPost = async () => {
    await addMutation.mutateAsync({ post: newPost });
    setShowAddDialog(false);
    setNewPost({ title: "", body: "", userId: 1 });
    updateURL();
  };

  const handleUpdatePost = async () => {
    if (!selectedPost) return;
    await updateMutation.mutateAsync({ post: selectedPost });
    setShowEditDialog(false);
    updateURL();
  };

  const handleDeletePost = async (id: number) => {
    await deleteMutation.mutateAsync({ id });
    updateURL();
  };

  useEffect(() => {
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);

  const searchPosts = () => updateURL();
  const fetchPostsByTag = () => updateURL();

  return {
    posts,
    total,
    loading,
    searchPosts,
    fetchPostsByTag,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
  } as const;
}
