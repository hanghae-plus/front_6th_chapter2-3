import { Search, Plus } from 'lucide-react'
import { useTagsQuery } from '@features/post/get-post-tags'
import { usePostsUI } from '@shared/store/posts-ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { useSearchState } from '../model/useSearchState'

export const PostsSearchWidget = () => {
  const { setShowAddDialog } = usePostsUI()
  const {
    searchQuery,
    setSearchQuery,
    selectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    handleSearch,
    handleSelectTag,
  } = useSearchState()

  // 태그 목록 쿼리
  const { data: tags = [] } = useTagsQuery()

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">게시물 관리자</h1>

      <div className="flex gap-4 items-center">
        {/* 검색창 */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8 w-64"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* 태그 선택 */}
        <Select value={selectedTag || 'all'} onValueChange={handleSelectTag}>
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

        {/* 정렬 기준 */}
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

        {/* 정렬 순서 */}
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="정렬 순서" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">오름차순</SelectItem>
            <SelectItem value="desc">내림차순</SelectItem>
          </SelectContent>
        </Select>

        {/* 게시물 추가 버튼 */}
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          게시물 추가
        </Button>
      </div>
    </div>
  )
}