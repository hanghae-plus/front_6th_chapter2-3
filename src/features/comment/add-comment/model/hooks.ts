import { useCommentStore } from '../../../../entities/comment/model/store';
import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { useDialogStore } from '../../../../shared/store/dialog';
import { addCommentAPI } from '../api/api';

export const useAddComment = () => {
  const { addCommentToPost, newComment, setNewComment } = useCommentStore();
  const { closeDialog } = useDialogStore();

  const addComment = async () => {
    if (!newComment.postId) return;

    try {
      const data = await addCommentAPI(newComment); // 인자 전달
      addCommentToPost(data.postId, data);
      closeDialog(DIALOG_KEYS.ADD_COMMENT);
      setNewComment({ body: '', postId: null, userId: 1 });
    } catch (error) {
      console.error('댓글 추가 오류: ', error);
    }
  };
  return {
    newComment,
    setNewComment,
    addComment,
  };
};
