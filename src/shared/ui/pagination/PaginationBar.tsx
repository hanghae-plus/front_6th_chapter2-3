import { Button } from ".."

interface PaginationBarProps {
  skip: number
  limit: number
  total: number
  onPrev: () => void
  onNext: () => void
  disabledPrev?: boolean
  disabledNext?: boolean
  className?: string
}

export const PaginationBar = ({
  skip,
  limit,
  total,
  onPrev,
  onNext,
  disabledPrev,
  disabledNext,
  className = "",
}: PaginationBarProps) => {
  const currentPage = limit > 0 ? Math.floor(skip / limit) + 1 : 1
  const totalPages = limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1

  const isPrevDisabled = disabledPrev ?? skip === 0
  const isNextDisabled = disabledNext ?? skip + limit >= total

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <div className="text-sm text-muted-foreground">
        {currentPage} / {totalPages}
      </div>
      <div className="flex gap-2">
        <Button disabled={isPrevDisabled} onClick={onPrev}>
          이전
        </Button>
        <Button disabled={isNextDisabled} onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  )
}
