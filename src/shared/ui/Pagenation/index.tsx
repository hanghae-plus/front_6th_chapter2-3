import { Button } from "../Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select"

interface PaginationProps {
  skip: number
  limit: number
  total: number
  onPreviousPage: () => void
  onNextPage: () => void
  onLimitChange: (limit: number) => void
}

const Pagination: FC<PaginationProps> = ({ skip, limit, total, onPreviousPage, onNextPage, onLimitChange }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => onLimitChange(Number(value))}>
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
        <Button disabled={skip === 0} onClick={onPreviousPage}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={onNextPage}>
          다음
        </Button>
      </div>
    </div>
  )
}
export default Pagination
