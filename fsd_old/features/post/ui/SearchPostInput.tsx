import { Input } from "@shared/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

export const SearchPostInput = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return
    }

    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)

      if (searchQuery) {
        updated.set("search", searchQuery)
      } else {
        updated.delete("search")
      }

      return updated
    })
  }

  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
    </div>
  )
}
