import { SearchPostInput } from "@features/post/components/SearchPostInput"
import { SortBySelect } from "@features/post/components/SortBySelect"
import { SortOrderSelect } from "@features/post/components/SortOrderSelect"
import { TagSelectFilter } from "@features/post/components/TagSelectFilter"

export const PostsFilterSection = () => {
  return (
    <div className="flex gap-4">
      <SearchPostInput />
      <TagSelectFilter />
      <SortBySelect />
      <SortOrderSelect />
    </div>
  )
}
