import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"

export interface PostRowVM {
  clientKey: string
  rowNo: number
  title: string
  body: string
  tags: string[]
  authorId?: number
  authorName?: string
  authorImage?: string
  likes: number
  dislikes: number
  origin: { id: number; clientId?: string }
}

interface PostsTableProps {
  rows: PostRowVM[]
  selectedTag: string
  setSelectedTag: (tag: string) => void
  onEdit: (origin: { id: number; clientId?: string }) => void
  onDelete: (postId: number, clientId?: string) => void
  searchQuery?: string
  onUserClick?: (user: { id: number; username: string; image: string }) => void
  onPostClick?: (origin: { id: number; clientId?: string }) => void
  onLike?: (postId: number, currentLikes: number, clientId?: string) => void
  onDislike?: (postId: number, currentDislikes: number, clientId?: string) => void
}

export const PostsTable = ({
  rows,
  selectedTag,
  setSelectedTag,
  onEdit,
  onDelete,
  searchQuery = "",
  onUserClick,
  onPostClick,
  onLike,
  onDislike,
}: PostsTableProps) => {
  // highlightText 함수를 컴포넌트 내부에 정의
  const highlightText = (text: string) => {
    if (!text || !searchQuery.trim()) return <span>{text}</span>
    const regex = new RegExp(`(${searchQuery})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">번호</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.clientKey}>
            <TableCell>{row.rowNo}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(row.title)}</div>
                <div className="flex flex-wrap gap-1">
                  {row.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {row.authorId != null && row.authorName && row.authorImage && (
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() =>
                    onUserClick?.({
                      id: row.authorId as number,
                      username: row.authorName as string,
                      image: row.authorImage as string,
                    })
                  }
                >
                  <img src={row.authorImage} alt={row.authorName} className="w-8 h-8 rounded-full" />
                  <span>{row.authorName}</span>
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1"
                  onClick={() => onLike?.(row.origin.id, row.likes, row.origin.clientId)}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="ml-1">{row.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1"
                  onClick={() => onDislike?.(row.origin.id, row.dislikes, row.origin.clientId)}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="ml-1">{row.dislikes}</span>
                </Button>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => onPostClick?.(row.origin)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(row.origin)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(row.origin.id, row.origin.clientId)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
