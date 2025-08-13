import React from "react"
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui"
import { usePostQueryParams } from "@/shared/hooks/use-post-query-params"
import { LIMIT_OPTIONS } from "@shared/constants"

interface PaginationProps {
  total: number
  onPrev: () => void
  onNext: () => void
  onLimitChange: (value: number) => void
  limitOptions?: number[]
}

export const Pagination: React.FC<PaginationProps> = ({
  total,
  onPrev,
  onNext,
  onLimitChange,
  limitOptions = LIMIT_OPTIONS,
}) => {
  const { param } = usePostQueryParams()
  const currentStart = Math.min(param.skip + 1, total)
  const currentEnd = Math.min(param.skip + param.limit, total)
  const canPrev = param.skip === 0
  const canNext = param.skip + param.limit >= total

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={String(param.limit)} onValueChange={(value) => onLimitChange(Number(value))}>
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
