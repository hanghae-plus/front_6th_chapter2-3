import { Dialog } from '../../shared/ui/components';
import { useDialogStore } from '../../shared/hook/useDialogStore';

export const DialogRoot = () => {
  const postModal = useDialogStore((state) => state.postModal);
  const setPostModal = useDialogStore((state) => state.setPostModal);

  const commentModal = useDialogStore((state) => state.commentModal);
  const setCommentModal = useDialogStore((state) => state.setCommentModal);

  return (
    <>
      {/* 게시물 대화상자 */}
      {postModal.show && (
        <Dialog
          open={postModal.show}
          onOpenChange={(open) =>
            setPostModal({ show: open, content: postModal.content })
          }
        >
          {postModal.content}
        </Dialog>
      )}
      {/* 댓글 대화상자 */}
      {commentModal.show && (
        <Dialog
          open={commentModal.show}
          onOpenChange={(open) =>
            setCommentModal({ show: open, content: commentModal.content })
          }
        >
          {commentModal.content}
        </Dialog>
      )}
    </>
  );
};
