// Post 상태 관리 store

export interface PostStore {
  // 상태
  posts: any[];
  total: number;
  skip: number;
  limit: number;
  searchQuery: string;
  selectedPost: any;
  sortBy: string;
  sortOrder: string;
  showAddDialog: boolean;
  showEditDialog: boolean;
  newPost: { title: string; body: string; userId: number };
  loading: boolean;
  tags: any[];
  selectedTag: string;
  showPostDetailDialog: boolean;

  // 액션
  setPosts: (posts: any[]) => void;
  setTotal: (total: number) => void;
  setSkip: (skip: number) => void;
  setLimit: (limit: number) => void;
  setSearchQuery: (searchQuery: string) => void;
  setSelectedPost: (selectedPost: any) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  setShowAddDialog: (showAddDialog: boolean) => void;
  setShowEditDialog: (showEditDialog: boolean) => void;
  setNewPost: (newPost: { title: string; body: string; userId: number }) => void;
  setLoading: (loading: boolean) => void;
  setTags: (tags: any[]) => void;
  setSelectedTag: (selectedTag: string) => void;
  setShowPostDetailDialog: (showPostDetailDialog: boolean) => void;
}
