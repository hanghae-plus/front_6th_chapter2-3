import SearchInput from "../../../features/posts/ui/search/SearchInput"
import TagSelect from "../../../features/posts/ui/selects/TagSelect"
import SortBySelect from "../../../features/posts/ui/selects/SortBySelect"
import OrderSelect from "../../../features/posts/ui/selects/OrderSelect"
import { useSearchMode } from "../../../features/posts/fetch-posts-by-mode/hooks/useSearchMode"
import { useTagMode } from "../../../features/posts/fetch-posts-by-mode/hooks/useTagMode.ts"
import { useSortMode } from "../../../features/posts/fetch-posts-by-mode/hooks/useSortMode"
import { useTagsQuery } from "../../../entities/post/hook"

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
