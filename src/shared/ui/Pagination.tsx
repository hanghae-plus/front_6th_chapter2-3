import { Button } from ".";
import { DropdownSelect } from "./DropdownSelect";

export const Pagination = ({
  limit,
  setLimit,
  skip,
  setSkip,
  total,
}: {
  limit: number;
  setLimit: (limit: number) => void;
  skip: number;
  setSkip: (skip: number) => void;
  total: number;
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <DropdownSelect
          value={limit.toString()}
          onChange={(value) => setLimit(Number(value))}
          options={[
            { key: "10", label: 10, value: "10" },
            { key: "20", label: 20, value: "20" },
            { key: "30", label: 30, value: "30" },
          ]}
          placeholder="10"
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
  );
};
