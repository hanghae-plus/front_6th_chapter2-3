import { Input } from "../../../../shared/ui"
import { Search } from "lucide-react"

interface SearchInputProps {
  searchMode: {
    value: string
    change: (value: string) => void
    update: (value: string) => void
  }
}

export default function SearchInput({ searchMode }: SearchInputProps) {
  const { value, change, update } = searchMode
  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="게시물 검색..."
          className="pl-8"
          value={value}
          onChange={(e) => change(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && update(value)}
        />
      </div>
    </div>
  )
}
