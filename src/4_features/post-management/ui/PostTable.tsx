import {
  Edit2,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';

import { Post, useDeletePostMutation } from '@/entities/post';
import { UserPick } from '@/entities/user';
import { API_CONSTANTS, UI_CONSTANTS } from '@/shared/constants';
import { highlightText, usePostsFilterStore, useUIStore } from '@/shared/lib';
import {
  Button,
  LoadingSpinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';

import {
  SelectedUserProperties,
  useFilteredPosts,
} from '../../filter-posts/hooks/useFilteredPosts';

export const PostTable = () => {
  const { posts, isLoading } = useFilteredPosts();
  const { selectedTag, setSelectedTag, searchQuery, limit } =
    usePostsFilterStore();
  const {
    setShowUserModal,
    setSelectedUser,
    setSelectedPost,
    setShowPostDetailDialog,
    setShowEditDialog,
  } = useUIStore();
  const { mutate: deletePost } = useDeletePostMutation({
    onError: error => {
      console.error('게시물 삭제 오류:', error);
    },
  });

  const handleClickTag = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleClickDeletePost = (id: number) => {
    deletePost(id);
  };

  const handleClickEditPost = (post: Post) => {
    setSelectedPost(post);
    setShowEditDialog(true);
  };

  const handleClickDetailPost = (post: Post) => {
    setSelectedPost(post);
    setShowPostDetailDialog(true);
  };

  const handleClickUser = (user: UserPick<SelectedUserProperties>) => {
    setShowUserModal(true);
    setSelectedUser(user);
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
        {isLoading ? (
          <TableRow>
            <TableCell className={`h-[${80 * limit}px]`} {...{ colSpan: 5 }}>
              <div className='flex justify-center items-center w-full h-full'>
                <LoadingSpinner />
              </div>
            </TableCell>
          </TableRow>
        ) : (
          posts.map(post => (
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
                        onClick={() => handleClickTag(tag)}
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
                  onClick={() => post.author && handleClickUser(post.author)}
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
                    onClick={() => handleClickDetailPost(post)}
                  >
                    <MessageSquare className={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleClickEditPost(post)}
                  >
                    <Edit2 className={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleClickDeletePost(post.id)}
                  >
                    <Trash2 className={UI_CONSTANTS.ICON_SIZES.MEDIUM} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
