import { Search } from "lucide-react"
import type { ChangeEvent } from "react"

import { usePostParamsStore } from "@/features/get-post/model"
import { Input } from "@/shared/ui/Input"

export function PostSearchInput() {
  const search = usePostParamsStore((state) => state.search)
  const { updateParam } = usePostParamsStore((state) => state.actions)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateParam("search", event.target.value)
  }

  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
        <Input placeholder="게시물 검색..." className="pl-8" value={search} onChange={handleChange} />
      </div>
    </div>
  )
}
