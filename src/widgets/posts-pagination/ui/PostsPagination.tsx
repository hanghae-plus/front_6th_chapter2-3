import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, PaginationBar } from "@shared/ui"

interface PostsPaginationProps {
  limit: number
  skip: number
  total: number
  onLimitChange: (limit: number) => void
  onPrev: () => void
  onNext: () => void
}

export const PostsPagination = ({ limit, skip, total, onLimitChange, onPrev, onNext }: PostsPaginationProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))}>
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
      <PaginationBar skip={skip} limit={limit} total={total} onPrev={onPrev} onNext={onNext} />
    </div>
  )
}
