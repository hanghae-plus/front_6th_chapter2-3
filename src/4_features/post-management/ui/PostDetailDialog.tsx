import { Plus } from 'lucide-react';

import { CommentList } from '@/features/comment-management/ui/CommentList';
import { UI_CONSTANTS } from '@/shared/constants';
import { highlightText, usePostsFilterStore, useUIStore } from '@/shared/lib';
import { Button, ContentDialog } from '@/shared/ui';

export const PostDetailDialog = () => {
  const {
    showPostDetailDialog,
    setShowPostDetailDialog,
    selectedPost,
    setShowAddCommentDialog,
  } = useUIStore();
  const { searchQuery } = usePostsFilterStore();

  if (!selectedPost) return null;

  const handleClickAddComment = () => {
    setShowAddCommentDialog(true);
  };

  return (
    <ContentDialog
      open={showPostDetailDialog}
      onOpenChange={setShowPostDetailDialog}
      title={highlightText(selectedPost.title, searchQuery)}
    >
      <div className='space-y-4 w-full'>
        <p>{highlightText(selectedPost?.body, searchQuery)}</p>
        <div className='mt-2'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-semibold'>댓글</h3>
            <Button size='sm' onClick={handleClickAddComment}>
              <Plus className={`${UI_CONSTANTS.ICON_SIZES.SMALL} mr-1`} />
              댓글 추가
            </Button>
          </div>
          <CommentList />
        </div>
      </div>
    </ContentDialog>
  );
};
