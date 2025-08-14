import { usePostParamsStore } from "@/features/get-post/model"
import { Button } from "@/shared/ui/Button"
import { Select } from "@/shared/ui/Select"

type PostPaginationProps = {
  total: number
}

export function PostPagination({ total }: PostPaginationProps) {
  const limit = usePostParamsStore((state) => state.limit)
  const skip = usePostParamsStore((state) => state.skip)
  const { updateParam } = usePostParamsStore((state) => state.actions)

  const handleLimitChange = (value: string) => {
    updateParam("limit", Number(value))
  }

  const handlePrev = () => {
    updateParam("skip", Math.max(0, skip - limit))
  }

  const handleNext = () => {
    updateParam("skip", skip + limit)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={handleLimitChange}>
          <Select.Trigger className="w-[180px]">
            <Select.Value placeholder="10" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="10">10</Select.Item>
            <Select.Item value="20">20</Select.Item>
            <Select.Item value="30">30</Select.Item>
          </Select.Content>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={handlePrev}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  )
}
