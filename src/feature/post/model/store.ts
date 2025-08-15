import { create } from "zustand"
import { User } from "../../../entities"
import { INIT_POST } from "../../../shared"
import { Post } from "../type"

export const useSelectedPostStore = create<{
  selectedPost: Post
  showAddDialog: boolean
  showEditDialog: boolean
  showPostDetailDialog: boolean
  setSelectedPost: (selectedPost: Post) => void
  setShowAddDialog: (showAddDialog: boolean) => void
  setShowEditDialog: (showEditDialog: boolean) => void
  setShowPostDetailDialog: (isDetailModal: boolean) => void
}>((set) => ({
  posts: [],
  selectedPost: INIT_POST,
  showAddDialog: false,
  showEditDialog: false,
  showPostDetailDialog: false,
  setSelectedPost: (selectedPost: Post) => {
    set((state) => ({ ...state, selectedPost }))
  },
  setShowAddDialog: (showAddDialog: boolean) => {
    set((state) => ({ ...state, showAddDialog }))
  },
  setShowEditDialog: (showEditDialog: boolean) => {
    set((state) => ({ ...state, showEditDialog }))
  },
  setShowPostDetailDialog: (showPostDetailDialog: boolean) => {
    set((state) => ({ ...state, showPostDetailDialog }))
  },
}))

export const useSearchQueryStore = create<{
  searchQuery: string
  setSearchQuery: (setSearchQuery: string) => void
}>((set) => ({
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}))

export const useSelectedUserStore = create<{
  selectedUser: User | null
  showUserModal: boolean
  setSelectedUser: (selectedUser: User | null) => void
  setShowUserModal: (showUserModal: boolean) => void
}>((set) => ({
  selectedUser: null,
  showUserModal: false,
  setSelectedUser: (selectedUser: User | null) => {
    set((state) => ({ ...state, selectedUser }))
  },
  setShowUserModal: (showUserModal: boolean) => {
    set((state) => ({ ...state, showUserModal }))
  },
}))
