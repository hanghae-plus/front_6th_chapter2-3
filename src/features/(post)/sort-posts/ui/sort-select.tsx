import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui';
import type { SortBy, SortOrder } from '../model/usePostSort';

type SortSelectProps = {
  sortBy: SortBy;
  sortOrder: SortOrder;
  onChangeBy: (by: SortBy) => void;
  onChangeOrder: (order: SortOrder) => void;
};

export function SortSelect({ sortBy, sortOrder, onChangeBy, onChangeOrder }: SortSelectProps) {
  return (
    <>
      <Select value={sortBy} onValueChange={(v) => onChangeBy(v as SortBy)}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='정렬 기준' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='none'>없음</SelectItem>
          <SelectItem value='id'>ID</SelectItem>
          <SelectItem value='title'>제목</SelectItem>
          <SelectItem value='reactions'>반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={(v) => onChangeOrder(v as SortOrder)}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='정렬 순서' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='asc'>오름차순</SelectItem>
          <SelectItem value='desc'>내림차순</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
