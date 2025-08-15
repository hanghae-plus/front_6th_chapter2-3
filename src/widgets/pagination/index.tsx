import { Button, Select } from "../../shared"
import { PaginationProps } from "./type"

export const Pagination = ({ limit, setLimit, total, skip, setSkip }: PaginationProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select
          value={limit.toString()}
          onValueChange={(value) => setLimit(Number(value))}
          placeholder="10"
          triggerProps={{ className: "w-[180px]" }}
          options={[
            { name: "10", value: 10 },
            { name: "20", value: 20 },
            { name: "30", value: 30 },
          ]}
        />
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
          다음
        </Button>
      </div>
    </div>
  )
}
