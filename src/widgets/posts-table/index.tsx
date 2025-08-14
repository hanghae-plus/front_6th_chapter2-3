import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import { useBasicUsers } from '@features/user/get-user'
import { usePostsBasic, usePostsBySearch, usePostsByTag } from '@features/post/get-post'
import { useDeletePostMutation } from '@features/post/delete-post'
import { IPost } from '@entities/post'
import { usePostsUI } from '@shared/store/posts-ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/Table'
import { Card, CardContent } from '@shared/ui/Card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import { IUser } from '@shared/model'

export const PostsTableWidget = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const { openPostDetail, openPostEdit, openUserModal } = usePostsUI()

  // URL에서 상태 읽기
  const [skip, setSkip] = useState(parseInt(queryParams.get('skip') || '0'))
  const [limit, setLimit] = useState(parseInt(queryParams.get('limit') || '10'))
  const searchQuery = queryParams.get('search') || ''
  const selectedTag = queryParams.get('tag') || ''

  // 사용자 목록 쿼리 (독립적 캐싱)
  const { data: usersData } = useBasicUsers()

  // 기본 게시물 목록 쿼리
  const { data: basicPostsData, isLoading: isBasicLoading } = usePostsBasic({
    limit,
    skip,
    enabled: !searchQuery && (!selectedTag || selectedTag === 'all'),
  })

  // 검색 게시물 쿼리
  const { data: searchPostsData, isLoading: isSearchLoading } = usePostsBySearch({
    query: searchQuery,
    enabled: !!searchQuery,
  })

  // 태그별 게시물 쿼리
  const { data: tagPostsData, isLoading: isTagLoading } = usePostsByTag({
    tag: selectedTag,
    enabled: !!selectedTag && selectedTag !== 'all' && !searchQuery,
  })

  // 게시물 삭제 뮤테이션
  const deletePostMutation = useDeletePostMutation()

  // 현재 활성화된 데이터 선택
  const rawPostsData = searchQuery
    ? searchPostsData
    : selectedTag && selectedTag !== 'all'
      ? tagPostsData
      : basicPostsData

  const isLoading = isBasicLoading || isSearchLoading || isTagLoading

  // 최종 데이터 조합 (useMemo로 최적화)
  const postsData = useMemo(() => {
    if (!rawPostsData || !usersData) return null

    const withAuthors: IPost[] = rawPostsData.posts.map((post: IPost) => ({
      ...post,
      author: usersData.users.find((u: IUser) => u.id === post.userId),
    }))

    return { posts: withAuthors, total: rawPostsData.total }
  }, [rawPostsData, usersData])

  // 현재 게시물 목록과 총 개수
  const posts = postsData?.posts || []
  const total = postsData?.total || 0

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams(location.search)
    if (skip) params.set('skip', skip.toString())
    if (limit) params.set('limit', limit.toString())
    navigate(`?${params.toString()}`)
  }

  // 사용자 모달 열기 - ID만 전달
  const handleUserModalOpen = (user: Pick<IUser, 'id'>) => {
    openUserModal(user.id)
  }

  // 하이라이트 함수
  const highlightText = (text: string, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, 'gi')
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  // 태그 클릭 핸들러
  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(location.search)
    params.set('tag', tag)
    navigate(`?${params.toString()}`)
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* 게시물 테이블 */}
        {isLoading ? (
          <div className="flex justify-center p-4">로딩 중...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>제목</TableHead>
                <TableHead className="w-[150px]">작성자</TableHead>
                <TableHead className="w-[150px]">반응</TableHead>
                <TableHead className="w-[150px]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.id}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{highlightText(post.title, searchQuery)}</div>
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.map((tag) => (
                          <span
                            key={tag}
                            className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                              selectedTag === tag
                                ? 'text-white bg-blue-500 hover:bg-blue-600'
                                : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
                            }`}
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => handleUserModalOpen(post.author!)}
                    >
                      <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                      <span>{post.author?.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.reactions?.likes || 0}</span>
                      <ThumbsDown className="w-4 h-4" />
                      <span>{post.reactions?.dislikes || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openPostDetail(post.id)}>
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openPostEdit(post.id)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deletePostMutation.mutate(post.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* 페이지네이션 */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <span>표시</span>
            <Select
              value={limit.toString()}
              onValueChange={(value) => {
                setLimit(Number(value))
                updateURL()
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectContent>
            </Select>
            <span>항목</span>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={skip === 0}
              onClick={() => {
                setSkip(Math.max(0, skip - limit))
                updateURL()
              }}
            >
              이전
            </Button>
            <Button
              disabled={skip + limit >= total}
              onClick={() => {
                setSkip(skip + limit)
                updateURL()
              }}
            >
              다음
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
