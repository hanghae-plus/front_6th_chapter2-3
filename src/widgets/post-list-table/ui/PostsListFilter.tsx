import { SelectTag } from "../../../features/filter/ui/SelectTag"
import { SortBySelect } from "../../../features/filter/ui/SortBySelect"
import { SortOrderSelect } from "../../../features/filter/ui/SortOrderSelect"
import { PostSearch } from "../../../features/post/ui/PostSearch"

export const PostsListFilter = () => {
  return (
    <div className="flex gap-4">
      <PostSearch />
      <SelectTag />
      <SortBySelect />
      <SortOrderSelect />
    </div>
  )
}
