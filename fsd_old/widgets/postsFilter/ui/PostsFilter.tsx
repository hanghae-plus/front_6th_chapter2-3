import { SearchPostInput, SortBySelect, SortOrderSelect } from "@features/post"
import { TagSelectFilter } from "@features/tag"

export const PostsFilter = () => {
  return (
    <div className="flex gap-4">
      <SearchPostInput />
      <TagSelectFilter />
      <SortBySelect />
      <SortOrderSelect />
    </div>
  )
}
