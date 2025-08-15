import { create } from "zustand";
import { PostType } from "./types";
import { UserType } from "@/entities/user/model/types";

interface PostState {
  selectedPost: Partial<PostType> | null;
  selectedTag: string;
  searchQuery: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  pagination: {
    skip: number;
    limit: number;
  };
  newPost: Partial<PostType>;
  selectedUser: UserType | null;
}

interface PostActions {
  setSelectedPost: (post: Partial<PostType> | null) => void;
  setSelectedTag: (tag: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setPagination: (skip: number, limit: number) => void;
  setNewPost: (post: Partial<PostType>) => void;
  resetNewPost: () => void;
  setSelectedUser: (user: UserType | null) => void;
}

export const usePostStore = create<PostState & PostActions>((set) => ({
  // 초기 상태
  selectedPost: null,
  selectedTag: "",
  searchQuery: "",
  sortBy: "",
  sortOrder: "asc",
  pagination: {
    skip: 0,
    limit: 10,
  },
  newPost: {
    title: "",
    body: "",
    userId: 1,
  },
  selectedUser: null,

  // 액션들
  setSelectedPost: (selectedPost) => set({ selectedPost }),
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setPagination: (skip, limit) => set({ pagination: { skip, limit } }),
  setNewPost: (newPost) => set({ newPost }),
  resetNewPost: () => set({ newPost: { title: "", body: "", userId: 1 } }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
