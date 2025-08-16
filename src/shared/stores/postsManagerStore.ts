import { create } from "zustand"
import { Comment, CommentDraft } from "../../types/comment.type"
import { Post, PostDraft, SearchInfo } from "../../types/product.type"
import { DetailedUser } from "../../types/user.type"

type PostsManagerState = {
  // 선택된 항목들
  selectedPost: Post | null
  selectedComment: Comment | null
  selectedUser: DetailedUser | null

  // 폼 상태
  postDraft: PostDraft
  commentDraft: CommentDraft

  // 다이얼로그 상태
  showPostDetailDialog: boolean
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean
  showAddDialog: boolean
  showEditDialog: boolean
  showUserModal: boolean

  // 검색 상태
  searchInfo: SearchInfo

  // 액션들
  setSelectedPost: (post: Post | null) => void
  setSelectedComment: (comment: Comment | null) => void
  setSelectedUser: (user: DetailedUser | null) => void

  setPostDraft: (draft: Partial<PostDraft>) => void
  setCommentDraft: (draft: Partial<CommentDraft>) => void
  resetPostDraft: () => void
  resetCommentDraft: () => void

  setShowPostDetailDialog: (show: boolean) => void
  setShowAddCommentDialog: (show: boolean) => void
  setShowEditCommentDialog: (show: boolean) => void
  setShowAddDialog: (show: boolean) => void
  setShowEditDialog: (show: boolean) => void
  setShowUserModal: (show: boolean) => void

  setSearchInfo: (info: Partial<SearchInfo>) => void
  resetSearchInfo: () => void
}

export const usePostsManagerStore = create<PostsManagerState>((set) => ({
  // 초기 상태
  selectedPost: null,
  selectedComment: null,
  selectedUser: null,

  postDraft: { title: "", body: "", userId: 1 },
  commentDraft: { body: "", postId: null, userId: 1 },

  showPostDetailDialog: false,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  showAddDialog: false,
  showEditDialog: false,
  showUserModal: false,

  searchInfo: {
    skip: 0,
    limit: 10,
    searchQuery: "",
    sortBy: "",
    sortOrder: "asc",
    selectedTag: "",
  },

  // 액션들
  setSelectedPost: (post) => set({ selectedPost: post }),
  setSelectedComment: (comment) => set({ selectedComment: comment }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  setPostDraft: (draft) =>
    set((state) => ({
      postDraft: { ...state.postDraft, ...draft },
    })),
  setCommentDraft: (draft) =>
    set((state) => ({
      commentDraft: { ...state.commentDraft, ...draft },
    })),
  resetPostDraft: () =>
    set({
      postDraft: { title: "", body: "", userId: 1 },
    }),
  resetCommentDraft: () =>
    set({
      commentDraft: { body: "", postId: null, userId: 1 },
    }),

  setShowPostDetailDialog: (show) => set({ showPostDetailDialog: show }),
  setShowAddCommentDialog: (show) => set({ showAddCommentDialog: show }),
  setShowEditCommentDialog: (show) => set({ showEditCommentDialog: show }),
  setShowAddDialog: (show) => set({ showAddDialog: show }),
  setShowEditDialog: (show) => set({ showEditDialog: show }),
  setShowUserModal: (show) => set({ showUserModal: show }),

  setSearchInfo: (info) =>
    set((state) => ({
      searchInfo: { ...state.searchInfo, ...info },
    })),
  resetSearchInfo: () =>
    set({
      searchInfo: {
        skip: 0,
        limit: 10,
        searchQuery: "",
        sortBy: "",
        sortOrder: "asc",
        selectedTag: "",
      },
    }),
}))
