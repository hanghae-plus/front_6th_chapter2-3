import { useCommentStore } from '../../../../entities/comment/model/store';
import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { useDialogStore } from '../../../../shared/store/dialog';
import { updateCommentAPI } from '../api/api';

export const useEditComment = () => {
  const { updateCommentInPost, selectedComment, setSelectedComment } = useCommentStore();
  const { closeDialog } = useDialogStore();

  const updateComment = async () => {
    if (!selectedComment) return;

    try {
      const data = await updateCommentAPI(selectedComment.id, { body: selectedComment.body });
      updateCommentInPost(data.postId, selectedComment.id, data);
      closeDialog(DIALOG_KEYS.EDIT_COMMENT);
    } catch (error) {
      console.error('댓글 업데이트 오류:', error);
    }
  };

  return {
    selectedComment,
    setSelectedComment,
    updateComment,
  };
};
