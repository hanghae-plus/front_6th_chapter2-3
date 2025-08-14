import { DropdownSelect } from "../../../shared/ui/DropdownSelect";
import { Input } from "../../../shared/ui";
import { Search } from "lucide-react";
import { Tag } from "../../../entities/tag/types";

interface PostFiltersBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchPosts: () => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  fetchPostsByTag: (tag: string) => void;
  updateURL: () => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: string;
  setSortOrder: (sortOrder: string) => void;
  tags: Tag[];
}

export const PostFiltersBar = ({
  searchQuery,
  setSearchQuery,
  searchPosts,
  selectedTag,
  setSelectedTag,
  fetchPostsByTag,
  updateURL,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  tags,
}: PostFiltersBarProps) => {
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
            onKeyDown={(e) => e.key === "Enter" && searchPosts()}
          />
        </div>
      </div>

      <DropdownSelect
        value={selectedTag}
        onChange={(value) => {
          setSelectedTag(value);
          fetchPostsByTag(value);
          updateURL();
        }}
        options={[
          { key: "all", label: "모든 태그", value: "all" },
          ...tags.map((tag) => ({ key: tag.url, label: tag.slug, value: tag.slug })),
        ]}
        placeholder="태그 선택"
      />
      <DropdownSelect
        value={sortBy}
        onChange={(value) => {
          setSortBy(value);
        }}
        options={[
          { key: "none", label: "없음", value: "none" },
          { key: "id", label: "ID", value: "id" },
          { key: "title", label: "제목", value: "title" },
          { key: "reactions", label: "반응", value: "reactions" },
        ]}
        placeholder="정렬 기준"
      />
      <DropdownSelect
        value={sortOrder}
        onChange={(value) => {
          setSortOrder(value);
        }}
        options={[
          { key: "asc", label: "오름차순", value: "asc" },
          { key: "desc", label: "내림차순", value: "desc" },
        ]}
        placeholder="정렬 순서"
      />
    </div>
  );
};
