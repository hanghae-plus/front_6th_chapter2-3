import SearchInput from "../../../features/posts/ui/search/SearchInput"
import TagSelect from "../../../features/posts/ui/selects/TagSelect"
import SortControls from "../../../features/posts/ui/selects/SortControls"
import { useSearchMode } from "../../../features/posts/fetch-posts-by-mode/hooks/useSearchMode"
import { useTagMode } from "../../../features/posts/fetch-posts-by-mode/hooks/useTagMode.ts"
import { useTagsQuery } from "../../../entities/post/hook"

export default function PostFilter() {
  const searchMode = useSearchMode()
  const tagMode = useTagMode()
  const tags = useTagsQuery()

  return (
    <div className="flex gap-4">
      <SearchInput searchMode={searchMode} />
      <TagSelect tagMode={tagMode} tags={tags.data || []} />
      <SortControls />
    </div>
  )
}
