import React from "react"
import { ThumbsDown, ThumbsUp, MessageSquare, Edit2, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button } from "../../../shared/ui"
import { HighlightText } from "../../../shared/ui/HighlightText"
import { PostItem } from "../../../entities/post/model/types"

export interface PostsTableProps {
  data: {
    rows: PostItem[]
    searchQuery: string
    selectedTag?: string
  }
  handlers: {
    onTagClick: (tag: string) => void
    onOpenDetail: (post: PostItem) => void
    onEdit: (post: PostItem) => void
    onDelete: (id: number) => void
    onAuthorClick: (author: PostItem["author"]) => void
  }
}

export const PostsTable: React.FC<PostsTableProps> = React.memo(({ data, handlers }) => {
  const { rows, searchQuery, selectedTag } = data
  const { onTagClick, onOpenDetail, onEdit, onDelete, onAuthorClick } = handlers

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
        {rows.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>
                  <HighlightText text={post.title} highlight={searchQuery} />
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => onTagClick(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>

            <TableCell>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onAuthorClick(post.author)}>
                {/* 안전 */}
                {post.author?.image ? (
                  <img src={post.author.image} alt={post.author.username} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted" />
                )}
                <span>{post.author?.username ?? "-"}</span>
              </div>
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes ?? 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes ?? 0}</span>
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
                <Button variant="ghost" size="sm" onClick={() => onDelete(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
})
PostsTable.displayName = "PostsTable"
