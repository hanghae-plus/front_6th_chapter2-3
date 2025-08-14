import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui"
import { LIMIT_OPTIONS } from "../config/constants.ts"
import React from "react"

interface PaginationProps {
  total: number
  skip: number
  limit: number
  onClickPrev: () => void
  onClickNext: () => void
  onChangeLimit: (value: string) => void
}

export const Pagination: React.FC<PaginationProps> = ({ total, skip, limit, onClickPrev, onClickNext, onChangeLimit }) => {

  const hasPrev = skip === 0
  const hasNext = skip + limit >= total

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => onChangeLimit(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            {
              LIMIT_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))
            }
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={hasPrev} onClick={onClickPrev}>
          이전
        </Button>
        <Button disabled={hasNext} onClick={onClickNext}>
          다음
        </Button>
      </div>
    </div>
  )
}