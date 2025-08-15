import { FilterSelect } from "../../../shared/ui/FilterSelect"
import { sortOrderOptions } from "../data"
import { useSortOrder } from "../model/useSortOrder"

export const SortOrderSelect = () => {
  const { sortOrder, changeSortOrder } = useSortOrder()

  return (
    <FilterSelect
      value={sortOrder}
      onValueChange={changeSortOrder}
      placeholder="정렬 순서"
      options={sortOrderOptions}
    />
  )
}
