import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import type { PostType, UserType } from '../../../entities';
import { usePosts, UpdatePostButton, DeletePostButton } from '../../../features';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  highlightText,
} from '../../../shared';

interface PostTableProps {
  onUserClick?: (user: UserType) => void;
  onPostDetailClick?: (post: PostType) => void;
}

export const PostTable = ({ onUserClick, onPostDetailClick }: PostTableProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const tag = searchParams.get('tag') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const sortOrder = searchParams.get('sortOrder') || '';
  const skip = parseInt(searchParams.get('skip') || '0');
  const limit = parseInt(searchParams.get('limit') || '10');

  const { posts, isLoading } = usePosts({
    skip,
    limit,
    searchQuery,
    sortBy,
    sortOrder,
    tag,
  });

  if (isLoading) {
    return <div className='flex justify-center p-4'>로딩 중...</div>;
  }

  const handleTagClick = (tag: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (tag === 'all') {
        params.delete('tag');
      } else {
        params.set('tag', tag);
      }
      return params;
    });
  };

  const handleUserClick = (user: UserType) => {
    onUserClick?.(user);
  };

  const handlePostDetailClick = (post: PostType) => {
    onPostDetailClick?.(post);
  };

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
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className='space-y-1'>
                <div>{highlightText(post.title, searchQuery)}</div>

                <div className='flex flex-wrap gap-1'>
                  {post.tags?.map((tagItem) => (
                    <span
                      key={tagItem}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        tag === tagItem
                          ? 'text-white bg-blue-500 hover:bg-blue-600'
                          : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
                      }`}
                      onClick={() => {
                        handleTagClick(tagItem);
                      }}
                    >
                      {tagItem}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className='flex items-center space-x-2 cursor-pointer'
                onClick={() => handleUserClick(post.author)}
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
                <Button variant='ghost' size='sm' onClick={() => handlePostDetailClick(post)}>
                  <MessageSquare className='w-4 h-4' />
                </Button>
                <UpdatePostButton post={post} />
                <DeletePostButton postId={post.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
