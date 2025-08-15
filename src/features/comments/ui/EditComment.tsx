import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { useCommentStore } from '../model/store';
import { useComments } from '../model/hooks.ts';

const EditComment = () => {
  const { showEditCommentDialog, setShowEditCommentDialog } = useCommentStore();
  const { selectedComment, setSelectedComment } = useCommentStore();
  const { updateComment } = useComments();
  const handelEditComment = () => {
    if (selectedComment?.id) {
      // ✅ API가 기대하는 형태로 전달
      updateComment.mutate(
        {
          id: selectedComment.id,
          body: selectedComment.body,
        },
        {
          onSuccess: () => {
            setShowEditCommentDialog(false);
          },
        },
      );
    }
  };

  return (
    <Dialog
      open={showEditCommentDialog}
      onOpenChange={setShowEditCommentDialog}
    >
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>댓글 수정</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <Input
            placeholder="댓글 내용"
            value={selectedComment?.body || ''}
            onChange={(e) =>
              setSelectedComment(
                selectedComment
                  ? {
                      ...selectedComment,
                      body: e.target.value,
                    }
                  : null,
              )
            }
          />
          <Button onClick={handelEditComment}>댓글 업데이트</Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default EditComment;
