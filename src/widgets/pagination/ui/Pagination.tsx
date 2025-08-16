import { useSearchParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from "@/shared/ui"
import { getTotal } from "../lib"

export const PaginationControl = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const skip = Number(searchParams.get("skip")) || 0
  const limit = Number(searchParams.get("limit")) || 10

  const total = getTotal(queryClient, searchParams)

  const handleSkipChange = (value: number) => {
    setSearchParams((prev) => {
      prev.set("skip", value.toString())
      return prev
    })
  }

  const handleLimitChange = (limit: number) => {
    setSearchParams((prev) => {
      prev.set("limit", limit.toString())
      return prev
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
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={() => handleSkipChange(Math.max(0, skip - limit))}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={() => handleSkipChange(skip + limit)}>
          다음
        </Button>
      </div>
    </div>
  )
}
