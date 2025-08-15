import { Search } from 'lucide-react';
import { useSearch } from '../model';
import {
  usePostsTags,
  useSortBy,
  useSortOrder,
  useTag,
  type PostSortBy,
  type SortOrder,
} from '@/entities/posts';
import { Input, Select, SelectTrigger, SelectValue } from '@/shared/ui';
import { SelectOptions } from '@/shared/ui/Select';

export const PostsFilter = () => {
  const { search, setSearch, commitSearch } = useSearch();
  const [selectedTag, setSelectedTag] = useTag();
  const [sortBy, setSortBy] = useSortBy();
  const [sortOrder, setSortOrder] = useSortOrder();
  const { data: tags } = usePostsTags();

  return (
    <div className="flex gap-4">
      {/* 검색 입력창 */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && commitSearch()}
          />
        </div>
      </div>

      {/* 태그 선택 */}
      <Select value={selectedTag} onValueChange={setSelectedTag}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectOptions
          options={[
            { value: 'all', name: '모든 태그' },
            ...(tags ?? []).map(({ slug }) => ({ value: slug, name: slug })),
          ]}
        />
      </Select>

      {/* 정렬 기준 */}
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectOptions<PostSortBy>
          options={[
            { value: 'none', name: '없음' },
            { value: 'id', name: 'ID' },
            { value: 'title', name: '제목' },
            { value: 'reactions', name: '반응' },
          ]}
        />
      </Select>

      {/* 정렬 순서 */}
      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectOptions<SortOrder>
          options={[
            { value: 'asc', name: '오름차순' },
            { value: 'desc', name: '내림차순' },
          ]}
        />
      </Select>
    </div>
  );
};
