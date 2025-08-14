import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { useDialogStore } from '../../../../shared/store/dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../shared/ui';
import { CommentsList } from '../../../../widgets/commentsList/ui/CommentsList';
import { useViewPost } from '../model/hooks';
import { useCommentStore } from '../../../../entities/comment/model/store';
import { useDeleteComment } from '../../../comment/delete-comment/model/hooks';
import { useLikeComment } from '../../../comment/like-comment/model/hooks';
import { highlightText } from '../../../../shared/utils/text';

export const PostDetailDialog = ({ searchQuery }: { searchQuery: string }) => {
  const { isDialogOpen, closeDialog } = useDialogStore();
  const { selectedPost } = useViewPost();
  const { comments, newComment, setNewComment, setSelectedComment } = useCommentStore();
  const { openDialog } = useDialogStore();
  const { deleteComment } = useDeleteComment();
  const { likeComment } = useLikeComment();

  const handleAddComment = (postId: number) => {
    setNewComment({ ...newComment, postId });
    openDialog(DIALOG_KEYS.ADD_COMMENT);
  };

  const handleEditComment = (comment: any) => {
    setSelectedComment(comment);
    openDialog(DIALOG_KEYS.EDIT_COMMENT);
  };

  return (
    <Dialog
      open={isDialogOpen(DIALOG_KEYS.POST_DETAIL)}
      onOpenChange={() => closeDialog(DIALOG_KEYS.POST_DETAIL)}
    >
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title || '', searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>{highlightText(selectedPost?.body || '', searchQuery)}</p>
          {selectedPost && (
            <CommentsList
              postId={selectedPost.id}
              comments={comments[selectedPost.id] || []}
              searchQuery={searchQuery}
              highlightText={highlightText}
              onAddComment={handleAddComment}
              onEditComment={handleEditComment}
              onDeleteComment={deleteComment}
              onLikeComment={likeComment}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
