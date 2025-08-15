import {
  Edit2,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';

import React from 'react';

import { highlightText } from '../../../shared/lib';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/ui';
import { Post } from '../model';

interface PostTableProps {
  posts: Post[];
  searchQuery?: string;
  selectedTag?: string;
  onOpenPostDetail: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (id: number) => void;
  onTagClick: (tag: string) => void;
  renderUserAvatar: (user: any) => React.ReactNode;
}

const PostTable: React.FC<PostTableProps> = ({
  posts,
  searchQuery = '',
  selectedTag = '',
  onOpenPostDetail,
  onEditPost,
  onDeletePost,
  onTagClick,
  renderUserAvatar,
}) => {
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
        {posts.map(post => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className='space-y-1'>
                <div>{highlightText(post.title, searchQuery)}</div>
                <div className='flex flex-wrap gap-1'>
                  {post.tags?.map(tag => (
                    <span
                      key={tag}
                      className={`cursor-pointer rounded-[4px] px-1 text-[9px] font-semibold ${
                        selectedTag === tag
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
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
              {post.author && renderUserAvatar(post.author)}
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <ThumbsUp className='h-4 w-4' />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className='h-4 w-4' />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onOpenPostDetail(post)}
                >
                  <MessageSquare className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onEditPost(post)}
                >
                  <Edit2 className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onDeletePost(post.id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PostTable;
