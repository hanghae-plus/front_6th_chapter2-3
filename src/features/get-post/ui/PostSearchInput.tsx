import { Search } from "lucide-react"

import { Input } from "@/shared/ui/Input"

interface PostSearchInputProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearch: () => void
}

export function PostSearchInput({ searchQuery, onSearchChange, onSearch }: PostSearchInputProps) {
  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSearch()}
        />
      </div>
    </div>
  )
}
