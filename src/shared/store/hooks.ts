import { useAtom } from "jotai"
import {
  skipAtom,
  limitAtom,
  totalAtom,
  searchQueryAtom,
  selectedTagAtom,
  sortByAtom,
  sortOrderAtom,
  loadingAtom,
  showAddDialogAtom,
  showEditDialogAtom,
  showAddCommentDialogAtom,
  showEditCommentDialogAtom,
  showPostDetailDialogAtom,
  showUserDialogAtom,
} from "./atoms"

export const usePagination = () => {
  const [skip, setSkip] = useAtom(skipAtom)
  const [limit, setLimit] = useAtom(limitAtom)
  const [total, setTotal] = useAtom(totalAtom)

  return {
    skip,
    setSkip,
    limit,
    setLimit,
    total,
    setTotal,
  }
}

export const useSearchFilter = () => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)
  const [sortBy, setSortBy] = useAtom(sortByAtom)
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom)

  return {
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  }
}

export const useLoading = () => {
  const [loading, setLoading] = useAtom(loadingAtom)

  return {
    loading,
    setLoading,
  }
}

export const usePostDialogs = () => {
  const [showAddDialog, setShowAddDialog] = useAtom(showAddDialogAtom)
  const [showEditDialog, setShowEditDialog] = useAtom(showEditDialogAtom)
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom)

  return {
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    showPostDetailDialog,
    setShowPostDetailDialog,
  }
}

export const useCommentDialogs = () => {
  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)

  return {
    showAddCommentDialog,
    setShowAddCommentDialog,
    showEditCommentDialog,
    setShowEditCommentDialog,
  }
}

export const useUserDialog = () => {
  const [showUserDialog, setShowUserDialog] = useAtom(showUserDialogAtom)

  return {
    showUserDialog,
    setShowUserDialog,
  }
}
