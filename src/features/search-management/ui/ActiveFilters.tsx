import { PostSearchParams } from "@/entities/post/model"

interface ActiveFiltersProps {
  searchCondition: PostSearchParams
}

export function ActiveFilters({ searchCondition }: ActiveFiltersProps) {
  const hasActiveFilters =
    searchCondition.search ||
    searchCondition.tag !== "all" ||
    (searchCondition.sortBy && searchCondition.sortBy !== "none")

  if (!hasActiveFilters) return null

  return (
    <div className="flex gap-2 text-sm">
      {searchCondition.search && (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">검색: "{searchCondition.search}"</span>
      )}
      {searchCondition.tag !== "all" && !searchCondition.search && (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">태그: {searchCondition.tag}</span>
      )}
      {searchCondition.sortBy &&
        searchCondition.sortBy !== "none" &&
        !searchCondition.search &&
        searchCondition.tag === "all" && (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
            정렬: {searchCondition.sortBy} ({searchCondition.order})
          </span>
        )}
    </div>
  )
}
