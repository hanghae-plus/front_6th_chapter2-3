import {
  Edit2,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { usePostModal } from '../model';
import { useUsers, type UsersResponse } from '@/entities/users';
import type { Post } from '@/entities/posts';
import { usePosts } from '@/entities/posts';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';
import { highlightText } from '@/shared/lib';

type Author = UsersResponse['users'][0];

type PostWithAuthor = Post & { author?: Author };

interface Props {
  limit: number;
  skip: number;
  searchQuery?: string;
  selectedTag?: string;
  onClickTag: (tag: string) => void;
  onClickOpenUserModal: (user: Author) => void;
  onClickOpenPostDetail: (post: Post) => void;
  onClickOpenEditDialog: (post: Post) => void;
  onClickDeletePost: (postId: number) => void;
}

export const PostsTable = ({
  limit,
  skip,
  searchQuery = '',
  selectedTag = '',
  onClickTag,
  onClickOpenUserModal,
  // onClickOpenPostDetail,
  onClickOpenEditDialog,
  onClickDeletePost,
}: Props) => {
  const { data: postsData, isLoading: postsLoading } = usePosts(
    limit,
    skip,
    searchQuery,
    selectedTag,
  );
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const loading = postsLoading || usersLoading;
  const posts: PostWithAuthor[] =
    postsData?.posts.map((post) => {
      const author = usersData?.users?.find((user) => user.id === post.userId);
      return { ...post, author };
    }) ?? [];
  const { open } = usePostModal();

  if (loading) {
    return <div className="flex justify-center p-4">로딩 중...</div>;
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
                      onClick={() => onClickTag(tag)}
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
                    onClickOpenUserModal(post.author);
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
                  // onClick={() => onClickOpenPostDetail(post)}
                  onClick={() => open(post)}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClickOpenEditDialog(post)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClickDeletePost(post.id)}
                >
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
