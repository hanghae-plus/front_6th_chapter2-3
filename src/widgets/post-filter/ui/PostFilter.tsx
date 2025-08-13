import { Search } from 'lucide-react';
import { useState } from 'react';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/ui/components';
import { useQueryParameter } from '../../../shared/hook/useQueryParameter';
import { usePostTagListQuery } from '../../../entities/post/model/hook';

const PostFilter = () => {
  const { params, setters } = useQueryParameter();

  const { data: tags } = usePostTagListQuery();
  const [inputValue, setInputValue] = useState(params.searchQuery);

  // 추후 기능별로 분리?
  return (
    <div className="flex gap-4">
      {/* 검색 서치바 */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setters.setSearchQuery(inputValue);
              }
            }}
          />
        </div>
      </div>

      {/* 태그 셀렉터 */}
      <Select
        value={params.selectedTag}
        onValueChange={(value) => {
          setters.setSelectedTag(value);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags?.map((tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 정렬 기준 */}
      <Select value={params.sortBy} onValueChange={setters.setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>

      {/* 정렬 순서 */}
      <Select value={params.sortOrder} onValueChange={setters.setSortOrder}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PostFilter;
