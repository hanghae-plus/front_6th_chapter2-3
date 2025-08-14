import { MessageSquare, Edit2, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shared/ui"
import type { Post } from "@entities/post/model"
import type { User } from "@entities/user/model"
import { highlightText } from "@shared/lib"
import { PostTagItem } from "@entities/post/ui"

interface PostsTableProps {
  posts: Array<Post & { author?: User }>
  selectedTag: string
  searchQuery: string
  onTagClick: (tag: string) => void
  onOpenUser: (user: User | undefined) => void
  onOpenDetail: (post: Post) => void
  onEdit: (post: Post) => void
  onDelete: (post: Post) => void
  isLoading: boolean
}

export const PostsTable = ({
  posts,
  selectedTag,
  searchQuery,
  onTagClick,
  onOpenUser,
  onOpenDetail,
  onEdit,
  onDelete,
  isLoading,
}: PostsTableProps) => {
  if (isLoading) {
    return <div className="flex justify-center p-4">로딩 중...</div>
  }

  return (
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
            <TableCell>
              {post.isTemporary ? (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  NEW
                </span>
              ) : (
                post.id
              )}
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <PostTagItem key={tag} tag={tag} isSelected={selectedTag === tag} onClick={() => onTagClick(tag)} />
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onOpenUser(post.author)}>
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
                <Button variant="ghost" size="sm" onClick={() => onOpenDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(post)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(post)}>
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
