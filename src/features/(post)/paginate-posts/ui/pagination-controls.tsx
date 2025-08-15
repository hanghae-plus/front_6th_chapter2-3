import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui';

type PaginationControlsProps = {
  limit: number;
  skip: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onChangeLimit: (value: number) => void;
};

export function PaginationControls({
  limit,
  skip,
  total,
  onPrev,
  onNext,
  onChangeLimit,
}: PaginationControlsProps) {
  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-2'>
        <span>표시</span>
        <Select value={String(limit)} onValueChange={(v) => onChangeLimit(Number(v))}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='10' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='10'>10</SelectItem>
            <SelectItem value='20'>20</SelectItem>
            <SelectItem value='30'>30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className='flex gap-2'>
        <Button disabled={skip === 0} onClick={onPrev}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
