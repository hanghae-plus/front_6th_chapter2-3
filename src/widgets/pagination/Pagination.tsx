import React from "react"
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui"

interface PaginationProps {
  total: number
  skip: number
  limit: number
  onPrev: () => void
  onNext: () => void
  onLimitChange: (value: number) => void
  limitOptions?: number[]
}

export const Pagination: React.FC<PaginationProps> = ({
  total,
  skip,
  limit,
  onPrev,
  onNext,
  onLimitChange,
  limitOptions = [10, 20, 30],
}) => {
  const currentStart = Math.min(skip + 1, total)
  const currentEnd = Math.min(skip + limit, total)
  const canPrev = skip === 0
  const canNext = skip + limit >= total

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="limit" />
          </SelectTrigger>
          <SelectContent>
            {limitOptions.map((opt) => (
              <SelectItem key={opt} value={String(opt)}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>항목</span>
        <span className="text-xs text-muted-foreground">
          {currentStart}-{currentEnd} / {total}
        </span>
      </div>
      <div className="flex gap-2">
        <Button disabled={canPrev} onClick={onPrev}>
          이전
        </Button>
        <Button disabled={canNext} onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  )
}
