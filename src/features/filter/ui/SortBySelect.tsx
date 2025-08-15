import { FilterSelect } from "../../../shared/ui/FilterSelect"
import { useSortBy } from "../model/useSortBy"
import { sortByOptions } from "../data"

export const SortBySelect = () => {
  const { sortBy, handleSortByChange } = useSortBy()

  return (
    <FilterSelect value={sortBy} onValueChange={handleSortByChange} placeholder="정렬 기준" options={sortByOptions} />
  )
}
