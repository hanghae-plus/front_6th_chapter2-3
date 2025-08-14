import {
  Edit2,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';

import type { User } from '@/entities/user';
import { API_CONSTANTS, UI_CONSTANTS } from '@/shared/constants';
import { highlightText } from '@/shared/lib';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';

import type { PostWithAuthor } from '../types';

interface Props {
  posts: PostWithAuthor[];
  searchQuery: string;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  updateURL: () => void;
  onClickDeletePost: (id: number) => void;
  onClickEditPost: (post: PostWithAuthor) => void;
  onClickDetailPost: (post: PostWithAuthor) => void;
  onClickUser: (user: User) => void;
}

export const PostTable = ({
  posts,
  searchQuery,
  selectedTag,
  setSelectedTag,
  updateURL,
  onClickDeletePost,
  onClickEditPost,
  onClickDetailPost,
  onClickUser,
}: Props) => {
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
                      className={`${UI_CONSTANTS.STYLES.TAG_SIZE} ${
                        selectedTag === tag
                          ? UI_CONSTANTS.STYLES.TAG_SELECTED
                          : UI_CONSTANTS.STYLES.TAG_DEFAULT
                      }`}
                      onClick={() => {
                        setSelectedTag(tag);
                        updateURL();
                      }}
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
                onClick={() => post.author && onClickUser(post.author)}
              >
                <img
                  src={post.author?.image}
                  alt={post.author?.username}
                  className={`${UI_CONSTANTS.ICON_SIZES.LARGE} rounded-full`}
                />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <ThumbsUp className={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
                <span>
                  {post.reactions?.likes ||
                    API_CONSTANTS.REACTIONS.DEFAULT_LIKES}
                </span>
                <ThumbsDown className={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
                <span>
                  {post.reactions?.dislikes ||
                    API_CONSTANTS.REACTIONS.DEFAULT_DISLIKES}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onClickDetailPost(post)}
                >
                  <MessageSquare className={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onClickEditPost(post)}
                >
                  <Edit2 className={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onClickDeletePost(post.id)}
                >
                  <Trash2 className={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
