import { MessageSquare, Edit2, ThumbsDown, ThumbsUp } from 'lucide-react';
import type { Post } from '@/entities/post';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui';
import { useMemo } from 'react';
import { DeletePostButton } from '@/features/(post)/delete-post';

type PostTableProps = {
  posts: Post[];
  loading?: boolean;
  searchQuery?: string;
  selectedTag?: string;
  onClickTag?: (tag: string) => void;
  onOpenDetail: (post: Post) => void;
  onOpenUser?: (userId: number) => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: number) => void;
};

function useHighlight(text: string | undefined, highlight: string | undefined) {
  return useMemo(() => {
    if (!text) return null;
    if (!highlight || !highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
        )}
      </span>
    );
  }, [text, highlight]);
}

export function PostTable({
  posts,
  loading = false,
  searchQuery,
  selectedTag,
  onClickTag,
  onOpenDetail,
  onOpenUser,
  onEdit,
  onDelete,
}: PostTableProps) {
  if (loading) {
    return <div className='flex justify-center p-4'>로딩 중...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[50px]'>ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className='w-[150px]'>작성자</TableHead>
          <TableHead className='w-[150px]'>반응</TableHead>
          <TableHead className='w-[150px]'>작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => {
          const titleNode = useHighlight(post.title, searchQuery);
          return (
            <TableRow key={post.id}>
              <TableCell>{post.id}</TableCell>
              <TableCell>
                <div className='space-y-1'>
                  <div>{titleNode}</div>
                  <div className='flex flex-wrap gap-1'>
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                          selectedTag === tag
                            ? 'text-white bg-blue-500 hover:bg-blue-600'
                            : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
                        }`}
                        onClick={() => onClickTag?.(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className='flex items-center space-x-2 cursor-pointer'
                  onClick={() => {
                    if (post.author?.id && onOpenUser) return onOpenUser(post.author.id);
                    return onOpenDetail(post);
                  }}
                >
                  <img
                    src={post.author?.image}
                    alt={post.author?.username}
                    className='w-8 h-8 rounded-full'
                  />
                  <span>{post.author?.username}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <ThumbsUp className='w-4 h-4' />
                  <span>{post.reactions?.likes || 0}</span>
                  <ThumbsDown className='w-4 h-4' />
                  <span>{post.reactions?.dislikes || 0}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Button variant='ghost' size='sm' onClick={() => onOpenDetail(post)}>
                    <MessageSquare className='w-4 h-4' />
                  </Button>
                  <Button variant='ghost' size='sm' onClick={() => onEdit(post)}>
                    <Edit2 className='w-4 h-4' />
                  </Button>
                  <DeletePostButton postId={post.id} onDeleted={() => onDelete(post.id)} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
