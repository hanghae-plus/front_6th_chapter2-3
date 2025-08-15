import { Dispatch, SetStateAction } from "react"

import { PostSearchParams } from "@/entities/post/model"
import { Button } from "@/shared/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"

interface PostPaginationProps {
  searchCondition: PostSearchParams
  setSearchCondition: Dispatch<SetStateAction<PostSearchParams>>
  total: number
}

export const PostPagination = ({ searchCondition, setSearchCondition, total }: PostPaginationProps) => {
  const currentPage = Math.floor(Number(searchCondition.skip) / Number(searchCondition.limit)) + 1
  const totalPages = Math.ceil(total / Number(searchCondition.limit))
  const hasNextPage = Number(searchCondition.skip) + Number(searchCondition.limit) < total
  const hasPrevPage = Number(searchCondition.skip) > 0

  // 페이지네이션
  const handleSkipChange = (skip: number) => {
    setSearchCondition((prev) => ({ ...prev, skip }))
  }

  // 페이지 크기 변경
  const handleLimitChange = (limit: number) => {
    setSearchCondition((prev) => ({ ...prev, limit, skip: 0 }))
  }

  // 이전 페이지
  const handlePrevPage = () => {
    const newSkip = Math.max(0, Number(searchCondition.skip) - Number(searchCondition.limit))
    handleSkipChange(newSkip)
  }
  // 다음 페이지
  const handleNextPage = () => {
    const newSkip = Number(searchCondition.skip) + Number(searchCondition.limit)
    handleSkipChange(newSkip)
  }

  return (
    <div className="flex justify-between items-center">
      {/* 페이지 크기 선택 */}
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select
          onValueChange={(value) => handleLimitChange(Number(value))}
          value={searchCondition.limit?.toString() || "10"}
        >
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

      {/* 페이지 정보 및 네비게이션 */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {currentPage} / {totalPages} 페이지
        </span>
        <div className="flex gap-2">
          <Button disabled={!hasPrevPage} onClick={handlePrevPage}>
            이전
          </Button>
          <Button disabled={!hasNextPage} onClick={handleNextPage}>
            다음
          </Button>
        </div>
      </div>
    </div>
  )
}
