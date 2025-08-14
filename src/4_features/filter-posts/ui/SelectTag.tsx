import { useGetTagsQuery } from '@/entities/tag';
import { usePostsFilterStore } from '@/shared/lib';
import {
  LoadingSpinner,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

interface Props {
  updateURL: () => void;
}

export const SelectTag = ({ updateURL }: Props) => {
  const { selectedTag, setSelectedTag } = usePostsFilterStore();
  const { data: tags, isLoading } = useGetTagsQuery();

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    updateURL();
  };

  return (
    <Select value={selectedTag} onValueChange={handleTagChange}>
      {isLoading ? (
        <SelectTrigger className='w-[180px]'>
          <LoadingSpinner size='sm' />
        </SelectTrigger>
      ) : (
        <>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='태그 선택' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>모든 태그</SelectItem>
            {tags &&
              tags.length > 0 &&
              tags.map(tag => (
                <SelectItem key={tag.url} value={tag.slug}>
                  {tag.slug}
                </SelectItem>
              ))}
          </SelectContent>
        </>
      )}
    </Select>
  );
};
