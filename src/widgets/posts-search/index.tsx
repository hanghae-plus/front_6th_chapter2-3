import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { useTagsQuery } from '@features/post/get-post-tags'
import { usePostsUI } from '@shared/store/posts-ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'

export const PostsSearchWidget = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const { setShowAddDialog } = usePostsUI()

  // URL에서 초기값 읽기
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '')
  const [selectedTag, setSelectedTag] = useState(queryParams.get('tag') || '')
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || '')
  const [sortOrder, setSortOrder] = useState(queryParams.get('sortOrder') || 'asc')

  // 태그 목록 쿼리
  const { data: tags = [] } = useTagsQuery()

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams(location.search)

    if (searchQuery) {
      params.set('search', searchQuery)
    } else {
      params.delete('search')
    }

    if (selectedTag && selectedTag !== 'all') {
      params.set('tag', selectedTag)
    } else {
      params.delete('tag')
    }

    if (sortBy && sortBy !== 'none') {
      params.set('sortBy', sortBy)
    } else {
      params.delete('sortBy')
    }

    if (sortOrder && sortOrder !== 'asc') {
      params.set('sortOrder', sortOrder)
    } else {
      params.delete('sortOrder')
    }

    navigate(`?${params.toString()}`)
  }

  // 검색 실행
  const handleSearch = () => {
    updateURL()
  }

  // 태그 선택 처리
  const handleSelectTag = (tag: string) => {
    const newTag = tag === 'all' ? '' : tag
    setSelectedTag(newTag)

    // 즉시 URL 업데이트
    const params = new URLSearchParams(location.search)
    if (newTag) {
      params.set('tag', newTag)
    } else {
      params.delete('tag')
    }
    navigate(`?${params.toString()}`)
  }

  // 정렬 변경 시 즉시 URL 업데이트
  useEffect(() => {
    updateURL()
  }, [sortBy, sortOrder])

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
