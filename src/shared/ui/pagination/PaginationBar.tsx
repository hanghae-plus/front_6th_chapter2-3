import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../index"
import { Button } from "../index"

interface PaginationBarProps {
  limitMode: {
    param: number
    update: (value: number) => void
  }
  pageNavigateMode: {
    state: {
      prevDisabled: boolean
      nextDisabled: boolean
    }
    action: {
      prevPage: () => void
      nextPage: () => void
    }
  }
}

export default function PaginationBar({ limitMode, pageNavigateMode }: PaginationBarProps) {
  const { prevDisabled, nextDisabled } = pageNavigateMode.state
  const { prevPage, nextPage } = pageNavigateMode.action
  const { param, update } = limitMode

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={param.toString()} onValueChange={(value) => update(Number(value))}>
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
        <Button disabled={prevDisabled} onClick={prevPage}>
          이전
        </Button>
        <Button disabled={nextDisabled} onClick={nextPage}>
          다음
        </Button>
      </div>
    </div>
  )
}
