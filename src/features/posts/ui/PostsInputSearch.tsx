import { Input } from "@/shared/ui"
import { usePostRouteParams } from "@/features/posts/model/usePostRouteParams.ts"
import { Search } from "lucide-react"
import { useState } from "react"

export function PostsInputSearch() {
  const { searchQuery, setSearchQuery } = usePostRouteParams()
  const [searchInput, setSearchInput] = useState(searchQuery)

  // 게시물 검색
  function handlePostsSearch() {
    setSearchQuery(searchInput)
  }

  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePostsSearch()}
        />
      </div>
    </div>
  )
}
