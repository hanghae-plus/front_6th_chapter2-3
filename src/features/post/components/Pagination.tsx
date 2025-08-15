import { usePostsSelector } from "@pages/PostsManagerPage/hooks/usePostsSelector"
import { Button } from "@shared/components/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/select"
import { useSearchParams } from "react-router-dom"

const LIMITS = [10, 20, 30]

export const Pagination = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const skipParams = parseInt(searchParams.get("skip") || "0")
  const limitParams = parseInt(searchParams.get("limit") || "10")
  const sortBy = searchParams.get("sortBy") || ""
  const sortOrder = searchParams.get("sortOrder") || "asc"
  const selectedTag = searchParams.get("tag") || ""
  const skip = skipParams ? Number(skipParams) : 0
  const limit = limitParams ? Number(limitParams) : 10

  const { total } = usePostsSelector({
    skip,
    limit,
    sortBy,
    sortOrder,
    searchQuery,
    selectedTag,
  })

  const handleLimitChange = (value: number) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)

      updated.set("limit", value.toString())
      updated.set("skip", "0")

      return updated
    })
  }

  const handlePrevMove = () => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)

      updated.set("skip", Math.max(0, skip - limit).toString())
      return updated
    })
  }

  const handleNextMove = () => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev)
      updated.set("skip", (skip + limit).toString())

      return updated
    })
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => handleLimitChange(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            {LIMITS.map((limit) => (
              <SelectItem key={limit} value={String(limit)}>
                {limit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={handlePrevMove}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={handleNextMove}>
          다음
        </Button>
      </div>
    </div>
  )
}
