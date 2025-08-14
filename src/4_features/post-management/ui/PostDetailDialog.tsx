import { Edit2, Plus, ThumbsUp, Trash2 } from 'lucide-react';

import {
  useDeleteCommentMutation,
  useGetCommentsQuery,
  useLikeCommentMutation,
} from '@/entities/comment';
import { UI_CONSTANTS } from '@/shared/constants';
import { highlightText, useUIStore } from '@/shared/lib';
import { Button, ContentDialog, LoadingSpinner } from '@/shared/ui';

export const PostDetailDialog = () => {
  const {
    showPostDetailDialog,
    setShowPostDetailDialog,
    selectedPost,
    searchQuery,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
  } = useUIStore();

  const { data: commentsData, isLoading } = useGetCommentsQuery(
    selectedPost?.id ?? null
  );
  const { mutate: likeComment } = useLikeCommentMutation({
    onError: error => {
      console.error('댓글 좋아요 오류:', error);
    },
  });
  const { mutate: deleteComment } = useDeleteCommentMutation({
    onError: error => {
      console.error('댓글 삭제 오류:', error);
    },
  });

  if (!selectedPost) return null;

  const handleClickAddComment = () => {
    // TODO
    // setNewComment(prev => ({ ...prev, postId: selectedPost.id }));
    setShowAddCommentDialog(true);
  };

  const handleClickLikeComment = (commentId: number) => {
    likeComment({ commentId, postId: selectedPost.id });
  };

  const handleClickEditComment = (commentId: number) => {
    // TODO
    // setSelectedComment(commentId);
    setShowEditCommentDialog(true);
  };

  const handleClickDeleteComment = (commentId: number) => {
    deleteComment(commentId);
  };

  return (
    <ContentDialog
      open={showPostDetailDialog}
      onOpenChange={setShowPostDetailDialog}
      title={highlightText(selectedPost.title, searchQuery)}
    >
      <div className='space-y-4'>
        <p>{highlightText(selectedPost?.body, searchQuery)}</p>
        <div className='mt-2'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-semibold'>댓글</h3>
            <Button size='sm' onClick={handleClickAddComment}>
              <Plus className={`${UI_CONSTANTS.ICON_SIZES.SMALL} mr-1`} />
              댓글 추가
            </Button>
          </div>
          <div className='space-y-1'>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              commentsData?.comments.map(comment => (
                <div
                  key={comment.id}
                  className='flex items-center justify-between text-sm border-b pb-1'
                >
                  <div className='flex items-center space-x-2 overflow-hidden'>
                    <span className='font-medium truncate'>
                      {comment.user.username}:
                    </span>
                    <span className='truncate'>
                      {highlightText(comment.body, searchQuery)}
                    </span>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleClickLikeComment(comment.id)}
                    >
                      <ThumbsUp className={UI_CONSTANTS.ICON_SIZES.SMALL} />
                      <span className='ml-1 text-xs'>{comment.likes}</span>
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleClickEditComment(comment.id)}
                    >
                      <Edit2 className={UI_CONSTANTS.ICON_SIZES.SMALL} />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleClickDeleteComment(comment.id)}
                    >
                      <Trash2 className={UI_CONSTANTS.ICON_SIZES.SMALL} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ContentDialog>
  );
};
