import { Search } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Input } from "@/shared/ui"

export const SearchPostInput = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [, setSearchParams] = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchParams((prev) => {
        prev.set("search", searchQuery)
        return prev
      })
    }
  }

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="게시물 검색..."
        className="pl-8"
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={handleKeydown}
      />
    </div>
  )
}
