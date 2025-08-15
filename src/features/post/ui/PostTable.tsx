import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from "@/shared/ui";
import { PostType } from "@/entities/post/model/types";
import { UserType } from "@/entities/user/model/types";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Edit2,
  Trash2,
} from "lucide-react";
import { highlightText } from "@/shared/lib";
import { useState } from "react";
import { UserDetailDialog } from "@/entities/user/ui/UserDetailDialog";
import { PostEditDialog, PostDetailDialog } from "@/features/post/ui";
import { usePostTable, usePostDialogs } from "@/features/post/api";

interface PostTableProps {
  posts: PostType[];
}

export const PostTable = ({ posts }: PostTableProps) => {
  const {
    selectedTag,
    searchQuery,
    handleTagClick,
    handleUserClick,
    handlePostDetailClick,
    handleEditClick,
    handleDeleteClick,
  } = usePostTable();
  const { selectedPost, selectedUser } = usePostDialogs();

  // 로컬 다이얼로그 상태
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleUserClickLocal = (user: UserType) => {
    handleUserClick(user);
    setShowUserDialog(true);
  };

  const handlePostDetailClickLocal = (post: PostType) => {
    handlePostDetailClick(post);
    setShowPostDetailDialog(true);
  };

  const handleEditClickLocal = (post: Partial<PostType>) => {
    handleEditClick(post);
    setShowEditDialog(true);
  };

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
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
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
                onClick={() => {
                  if (post.author) {
                    handleUserClickLocal(post.author);
                  }
                }}
              >
                <img
                  src={post.author?.image}
                  alt={post.author?.username}
                  className="w-8 h-8 rounded-full"
                />
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePostDetailClickLocal(post)}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditClickLocal(post)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      {/* 사용자 상세 보기 */}
      {selectedUser && (
        <UserDetailDialog
          open={showUserDialog}
          onClose={() => setShowUserDialog(false)}
          selectedUser={selectedUser}
        />
      )}

      {/* 게시물 상세 보기 */}
      {showPostDetailDialog && (
        <PostDetailDialog
          open={showPostDetailDialog}
          onClose={() => setShowPostDetailDialog(false)}
          selectedPost={selectedPost}
        />
      )}

      {/* 게시물 수정 */}
      {showEditDialog && (
        <PostEditDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          selectedPost={selectedPost}
        />
      )}
    </Table>
  );
};
