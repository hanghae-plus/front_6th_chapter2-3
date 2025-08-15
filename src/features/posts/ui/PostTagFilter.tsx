import { usePostFilterStore } from '../model/store';
import { useTags } from '@/features/tags/model/hooks';
import { Select } from '@/shared/ui/select';

const PostTagFilter = () => {
  const { selectedTag, setFilter } = usePostFilterStore();
  const { data: tags } = useTags();

  return (
    <Select
      value={selectedTag}
      onValueChange={(value) => setFilter('selectedTag', value)}
    >
      <Select.Trigger className="w-[180px]">
        <Select.Value placeholder="태그 선택" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="all">모든 태그</Select.Item>
        {tags?.map((tag) => (
          <Select.Item key={tag.url} value={tag.slug}>
            {tag.slug}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};

export default PostTagFilter;
