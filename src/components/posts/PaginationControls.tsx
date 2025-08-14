import { Button } from "@/components";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components";

interface PaginationControlsProps {
  skip: number;
  limit: number;
  total: number;
  setSkip: (skip: number) => void;
  setLimit: (limit: number) => void;
}

export const PaginationControls = ({
  skip,
  limit,
  total,
  setSkip,
  setLimit,
}: PaginationControlsProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
          <SelectTrigger className="w-[80px]">
            <SelectValue />
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
        <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
          다음
        </Button>
      </div>
    </div>
  );
};
