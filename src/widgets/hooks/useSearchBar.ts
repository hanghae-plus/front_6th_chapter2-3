import { usePostStore } from "@/entities/post/model/store";
import { useGetTagsQuery } from "@/entities/post/api/hooks";

export const useSearchBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = usePostStore();

  const { data: tags = [] } = useGetTagsQuery();

  const handleSearch = () => {
    // 검색 로직은 이미 usePosts에서 처리됨
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    tags,
    handleSearch,
  };
};
