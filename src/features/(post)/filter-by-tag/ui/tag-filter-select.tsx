import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui';

type TagFilterSelectProps = {
  value: string;
  tags: string[];
  onChange: (value: string) => void;
};

export function TagFilterSelect({ value, tags, onChange }: TagFilterSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='태그 선택' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>모든 태그</SelectItem>
        {tags.map((tag) => (
          <SelectItem key={tag} value={tag}>
            {tag}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
