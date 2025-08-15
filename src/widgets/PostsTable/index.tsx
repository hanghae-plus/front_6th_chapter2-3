import { MessageSquare, Edit2, Trash2, ThumbsDown, ThumbsUp } from 'lucide-react';
import React from 'react';

import {
  useDialogState,
  usePostsState,
  usePostActions,
  useSelectionState,
} from '../../entities/post/model/hooks';
import type { Post, UserLite } from '../../entities/post/model/types';
import { highlightText } from '../../shared/lib/highlightText';
import {
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../../shared/ui';

const PostsTable: React.FC = () => {
  const { posts, searchQuery, selectedTag, setSelectedTag } = usePostsState();

  const { setSelectedPost, setSelectedUser } = useSelectionState();

  const { setShowEditDialog, setShowPostDetailDialog, setShowUserModal } = useDialogState();

  const { deletePost } = usePostActions();

  const onTagClick = (tag: string) => setSelectedTag(tag);

  const onOpenPostDetail = (post: Post) => {
    setSelectedPost(post);
    setShowPostDetailDialog(true);
  };

  const onEditPost = (post: Post) => {
    setSelectedPost(post);
    setShowEditDialog(true);
  };

  const onDeletePost = (id: number) => deletePost(id);

  const onAuthorClick = (user: UserLite) => {
    setSelectedUser(user);
    setShowUserModal(true);
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
                  {post.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? 'text-white bg-blue-500 hover:bg-blue-600'
                          : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
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
              <div
                className='flex items-center space-x-2 cursor-pointer'
                onClick={() => post.author && onAuthorClick(post.author)}
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
                <Button variant='ghost' size='sm' onClick={() => onOpenPostDetail(post)}>
                  <MessageSquare className='w-4 h-4' />
                </Button>
                <Button variant='ghost' size='sm' onClick={() => onEditPost(post)}>
                  <Edit2 className='w-4 h-4' />
                </Button>
                <Button variant='ghost' size='sm' onClick={() => onDeletePost(post.id)}>
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PostsTable;
