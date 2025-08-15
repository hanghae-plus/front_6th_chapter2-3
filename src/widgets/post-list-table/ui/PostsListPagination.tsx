import { useAtom } from "jotai"
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui/index"
import { skipAtom, limitAtom, totalPostsAtom } from "../../../store/postsAtoms"
import { useEffect } from "react"
import { calculatePaginationInfo } from "../lib/pagination"

export const PostsListPagination = () => {
  const [skip, setSkip] = useAtom(skipAtom)
  const [limit, setLimit] = useAtom(limitAtom)
  const [total] = useAtom(totalPostsAtom)

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log("페이지네이션 상태:", { skip, limit, total })
  }, [skip, limit, total])

  const handleSkipChange = (newSkip: number) => {
    setSkip(newSkip)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    // limit이 변경되면 skip을 0으로 리셋
    setSkip(0)
  }

  // 페이지네이션 정보 계산
  const { currentPage, totalPages, isPrevDisabled, isNextDisabled } = calculatePaginationInfo(skip, limit, total)

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
        <span className="text-sm text-gray-600">
          (전체 {total}개, {currentPage}/{totalPages} 페이지)
        </span>
      </div>
      <div className="flex gap-2">
        <Button
          disabled={isPrevDisabled}
          onClick={() => handleSkipChange(Math.max(0, skip - limit))}
          variant="outline"
          className={isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""}
        >
          이전
        </Button>
        <Button
          disabled={isNextDisabled}
          onClick={() => handleSkipChange(skip + limit)}
          variant="outline"
          className={isNextDisabled ? "opacity-50 cursor-not-allowed" : ""}
        >
          다음
        </Button>
      </div>
    </div>
  )
}
