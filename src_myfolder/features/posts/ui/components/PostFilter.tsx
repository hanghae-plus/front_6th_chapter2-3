import SearchInput from "../search/SearchInput"
import TagSelect from "../selects/TagSelect"
import SortBySelect from "../selects/SortBySelect"
import OrderSelect from "../selects/OrderSelect"
import { useSearchMode } from "../../fetch-posts-by-mode/hooks/useSearchMode"
import { useTagMode } from "../../fetch-posts-by-mode/hooks/useTagMode.ts"
import { useSortMode } from "../../fetch-posts-by-mode/hooks/useSortMode"
import { useTagsQuery } from "../../hooks/hook"

export default function PostFilter() {
  const searchMode = useSearchMode()
  const tagMode = useTagMode()
  const sortMode = useSortMode()
  const tags = useTagsQuery()

  return (
    <div className="flex gap-4">
      <SearchInput searchMode={searchMode} />
      <TagSelect tagMode={tagMode} tags={tags.data || []} />
      <SortBySelect sortMode={sortMode} />
      <OrderSelect sortMode={sortMode} />
    </div>
  )
}
