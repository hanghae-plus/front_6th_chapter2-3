import { ThumbsDown, ThumbsUp } from 'lucide-react';
import {
  DeletePostButton,
  EditPostButton,
  OpenPostDialogButton,
  useSearch,
} from '@/features/posts';
import { OpenUserDetailButton } from '@/features/users';
import { usePosts, useTag, type Post } from '@/entities/posts';
import { useUsers, type UsersResponse } from '@/entities/users';
import { highlightText } from '@/shared/lib';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';

type Author = UsersResponse['users'][0];

type PostWithAuthor = Post & { author?: Author };

export const PostsTable = () => {
  const { search } = useSearch();
  const [selectedTag, setSelectedTag] = useTag();
  const { data: postsData, isLoading: postsLoading } = usePosts();
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const loading = postsLoading || usersLoading;
  const posts: PostWithAuthor[] =
    postsData?.posts.map((post) => {
      const author = usersData?.users?.find((user) => user.id === post.userId);
      return { ...post, author };
    }) ?? [];

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
                <div>{highlightText(post.title, search)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? 'text-white bg-blue-500 hover:bg-blue-600'
                          : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
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
              <OpenUserDetailButton
                image={post.author?.image ?? ''}
                username={post.author?.username ?? ''}
                userId={post.author?.id ?? null}
              />
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
                <OpenPostDialogButton post={post} />

                <EditPostButton post={post} />

                <DeletePostButton postId={post.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
