import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import { usePostsUI } from '@shared/store/posts-ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/Table'
import { Card, CardContent } from '@shared/ui/Card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import { IUser } from '@shared/model'
import { usePostsTableData } from '../model/usePostsTableData'
import { highlightText } from '../lib/textUtils'

export const PostsTableWidget = () => {
  const { openPostDetail, openPostEdit, openUserModal } = usePostsUI()
  const {
    posts,
    total,
    isLoading,
    searchQuery,
    selectedTag,
    skip,
    setSkip,
    limit,
    setLimit,
    updateURL,
    handleTagClick,
    deletePostMutation,
  } = usePostsTableData()

  // 사용자 모달 열기 - ID만 전달
  const handleUserModalOpen = (user: Pick<IUser, 'id'>) => {
    openUserModal(user.id)
  }

  // 하이라이트 렌더링
  const renderHighlightedText = (text: string, highlight: string) => {
    const parts = highlightText(text, highlight)
    if (!parts || typeof parts === 'object' && '__html' in parts) {
      return <span>{text}</span>
    }
    
    return (
      <span>
        {Array.isArray(parts) && parts.map((part) => 
          part.isHighlighted ? (
            <mark key={part.key}>{part.text}</mark>
          ) : (
            <span key={part.key}>{part.text}</span>
          )
        )}
      </span>
    )
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
                      <div>{renderHighlightedText(post.title, searchQuery)}</div>
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