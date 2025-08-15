import { ThumbsDown, ThumbsUp } from 'lucide-react';

import { Post } from '../model/types';

import { DeletePostButton, EditPostButton, usePostFilter, ViewPostButton } from '@/features';
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  HighlightText,
} from '@/shared/ui';
import { useProfileDialogStore } from '@/widgets/user-profile-dialog/model/profileDialogStore';

export const PostTable = ({ posts }: { posts: Post[] }) => {
  const { openModal } = useProfileDialogStore();
  const { setSelectedTag } = usePostFilter();

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
        {posts.map((post: Post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className='space-y-1'>
                <div>
                  <HighlightText text={post.title} />
                </div>
                <div className='flex flex-wrap gap-1'>
                  {post.tags?.map((tag) => (
                    <span key={tag} className={`...`} onClick={() => setSelectedTag(tag)}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className='flex items-center space-x-2 cursor-pointer'
                onClick={() => post.author && openModal(post.author?.id)}
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
                <ViewPostButton post={post} />
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
