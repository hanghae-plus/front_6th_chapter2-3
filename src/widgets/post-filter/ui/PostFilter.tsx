import SearchInput from "../../search-input/ui/SearchInput"
import TagSelect from "../../tag-select/ui/TagSelect"
import SortControls from "../../sort-controls/ui/SortControls"
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
