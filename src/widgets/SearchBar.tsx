import { Search } from "lucide-react";
import { Input } from "@/shared/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui";
import { TagType } from "@/entities/post/model/types";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchPosts: () => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  fetchPostsByTag: (tag: string) => void;
  updateURL: () => void;
  tags: TagType[];
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: string;
  setSortOrder: (sortOrder: string) => void;
}

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  searchPosts,
  selectedTag,
  setSelectedTag,
  fetchPostsByTag,
  updateURL,
  tags,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: SearchBarProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchPosts()}
          />
        </div>
      </div>
      <Select
        value={selectedTag}
        onValueChange={(value) => {
          setSelectedTag(value);
          fetchPostsByTag(value);
          updateURL();
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
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
      <Select value={sortOrder} onValueChange={setSortOrder}>
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
