import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"
import { LIMIT_OPTIONS } from "@/views/post-management-page/static-model"

type Props = {
  total: number
  limit: number
  skip: number
  handleLimitChange: (limit: number) => void
  handlePreviousPage: () => void
  handleNextPage: () => void
}

export const PostListTablePagination = ({
  limit,
  skip,
  total,
  handleLimitChange,
  handlePreviousPage,
  handleNextPage,
}: Props) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => handleLimitChange(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={LIMIT_OPTIONS[0].toString()} />
          </SelectTrigger>

          <SelectContent>
            {LIMIT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={handlePreviousPage}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={handleNextPage}>
          다음
        </Button>
      </div>
    </div>
  )
}
