import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/ui/Table"
import { Button } from "../../../shared/ui/Button"
import { Edit2, MessageSquare, Trash2, ThumbsDown, ThumbsUp } from "lucide-react"
import { Post } from "../model/types"
import { highlightText } from "../../../shared/utils/highlightText"
import TagChip from "../../tag/ui/TagChip"
import UserAvatar from "../../user/ui/UserAvatar"

interface PostTableProps {
  posts: Post[]
  searchQuery: string
  selectedTag: string
  onTagClick: (tag: string) => void
  onUserClick: (user: any) => void
  onPostDetail: (post: Post) => void
  onEditPost: (post: Post) => void
  onDeletePost: (id: number) => void
}

const PostTable = ({
  posts,
  searchQuery,
  selectedTag,
  onTagClick,
  onUserClick,
  onPostDetail,
  onEditPost,
  onDeletePost,
}: PostTableProps) => {
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
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery)}</div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <TagChip key={tag} tag={tag} isSelected={selectedTag === tag} onClick={() => onTagClick(tag)} />
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <UserAvatar user={post.author} onClick={() => onUserClick(post.author)} />
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
                <Button variant="ghost" size="sm" onClick={() => onPostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEditPost(post)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeletePost(post.id)}>
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

export default PostTable
