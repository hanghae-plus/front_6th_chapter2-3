import { Search } from "lucide-react"
import type { ChangeEvent, KeyboardEvent } from "react"

import { Input } from "@/base/ui/Input"
import { usePostParamsStore } from "@/features/get-post/model"

export function PostSearchInput() {
  const searchInput = usePostParamsStore((state) => state.searchInput)
  const { updateParam, executeSearch } = usePostParamsStore((state) => state.actions)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateParam("searchInput", event.target.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      executeSearch()
    }
  }

  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={searchInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
