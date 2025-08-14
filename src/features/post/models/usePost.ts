import { useState } from "react";
import { addPost, deletePost, getPostBySearch, getPostByTag, getPosts, updatePost } from "../../../entities/post/api";
import { getAllUsers } from "../../../entities/user/api";
import { Post } from "../../../entities/post/types";

export function usePosts({
  limit,
  skip,
  searchQuery,
  newPost,
  setNewPost,
  selectedPost,
  setShowAddDialog,
  setShowEditDialog,
}: {
  limit: number;
  skip: number;
  searchQuery: string;
  newPost: Post;
  selectedPost: Post;
  setNewPost: (post: Partial<Post>) => void;
  setShowAddDialog: (show: boolean) => void;
  setShowEditDialog: (show: boolean) => void;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // 게시물 가져오기
  const fetchPosts = async () => {
    setLoading(true);
    const postsData = await getPosts({ limit, skip });
    const usersData = await getAllUsers();

    try {
      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }));
      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error("게시물 가져오기 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const postsData = await getPostBySearch({ search: searchQuery });
      setPosts(postsData.posts);
      setTotal(postsData.total);
    } catch (error) {
      console.error("게시물 검색 오류:", error);
    }
    setLoading(false);
  };

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts();
      return;
    }
    setLoading(true);
    try {
      const postsData = await getPostByTag({ tag });
      const usersData = await getAllUsers();

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }));

      setPosts(postsWithUsers);
      setTotal(postsData.total);
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error);
    }
    setLoading(false);
  };

  // 게시물 추가
  const handleAddPost = async () => {
    try {
      const data = await addPost({ post: newPost });
      const usersData = await getAllUsers();
      data.author = usersData.users.find((user) => user.id === data.userId);

      setPosts([data, ...posts]);
      setShowAddDialog(false);
      setNewPost({ title: "", body: "", userId: 1 });
    } catch (error) {
      console.error("게시물 추가 오류:", error);
    }
  };

  // 게시물 업데이트
  const handleUpdatePost = async () => {
    try {
      if (!selectedPost) return;
      const updatedPost = await updatePost({ post: selectedPost });
      const usersData = await getAllUsers();
      updatedPost.author = usersData.users.find((user) => user.id === updatedPost.userId);

      setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
      setShowEditDialog(false);
    } catch (error) {
      console.error("게시물 업데이트 오류:", error);
    }
  };

  // 게시물 삭제
  const handleDeletePost = async (id: number) => {
    try {
      await deletePost({ id });
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("게시물 삭제 오류:", error);
    }
  };

  return {
    posts,
    total,
    loading,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
  } as const;
}
