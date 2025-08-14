import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shared/ui"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import type { Post } from "../../entities/post/model"
import type { UserSummary } from "../../entities/user/model"

interface PostsTableProps {
  posts: Post[]
  selectedTag: string
  setSelectedTag: (tag: string) => void
  onEdit: (post: Post) => void
  onDelete: (postId: number, clientId?: string) => void
  searchQuery?: string
  onUserClick?: (user: UserSummary) => void
  onPostClick?: (post: Post) => void
  onLike?: (postId: number, currentLikes: number, clientId?: string) => void
  onDislike?: (postId: number, currentDislikes: number, clientId?: string) => void
  skip: number
  total: number
  sortOrder: string
}

export const PostsTable = ({
  posts,
  selectedTag,
  setSelectedTag,
  onEdit,
  onDelete,
  searchQuery = "",
  onUserClick,
  onPostClick,
  onLike,
  onDislike,
  skip,
  total,
  sortOrder,
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
        {posts.map((post, idx) => (
          <TableRow key={post.clientId ?? `${post.id}`}>
            <TableCell>{sortOrder === "desc" ? total - (skip + idx) : skip + idx + 1}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title)}</div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
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
              {post.author && (
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onUserClick?.(post.author!)}>
                  <img src={post.author.image} alt={post.author.username} className="w-8 h-8 rounded-full" />
                  <span>{post.author.username}</span>
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1"
                  onClick={() => onLike?.(post.id, post.reactions?.likes ?? 0, post.clientId)}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="ml-1">{post.reactions?.likes ?? 0}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1"
                  onClick={() => onDislike?.(post.id, post.reactions?.dislikes ?? 0, post.clientId)}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="ml-1">{post.reactions?.dislikes ?? 0}</span>
                </Button>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => onPostClick?.(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(post)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(post.id, post.clientId)}>
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
