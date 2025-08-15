import { Select } from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import { usePostFilterStore } from '../model/store';

const Pagination = ({ total }: { total: number }) => {
  const { skip, limit, setFilter } = usePostFilterStore();
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select
          value={limit.toString()}
          onValueChange={(value) => setFilter('limit', Number(value))}
        >
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
        <Button
          disabled={skip === 0}
          onClick={() => setFilter('skip', Math.max(0, skip - limit))}
        >
          이전
        </Button>
        <Button
          disabled={skip + limit >= total}
          onClick={() => setFilter('skip', skip + limit)}
        >
          다음
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
