import { Button } from "@/components";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components";
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import type { Post, UserSummary } from "@/types";

interface PostsTableProps {
  posts: Post[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  highlightText: (text: string, highlight: string) => React.ReactNode;
  openPostDetail: (post: Post) => void;
  openUserModal: (user: UserSummary) => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: number) => void;
}

export const PostsTable = ({
  posts,
  selectedTag,
  setSelectedTag,
  highlightText,
  openPostDetail,
  openUserModal,
  onEdit,
  onDelete,
}: PostsTableProps) => {
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
                <div>{highlightText(post.title, "")}</div>
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
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => openUserModal(post.author!)}
                >
                  <img src={post.author.image} alt={post.author.username} className="w-8 h-8 rounded-full" />
                  <span>{post.author.username}</span>
                </div>
              )}
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
                <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
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
  );
};
