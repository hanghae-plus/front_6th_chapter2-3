import { usePostsStore } from '../../../../entities/post/model/store';
import { useCommentStore } from '../../../../entities/comment/model/store';
import { useDialogStore } from '../../../../shared/store/dialog';
import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { fetchPostComments } from '../api/api';

export const useViewPost = () => {
  const { selectedPost, setSelectedPost } = usePostsStore();
  const { comments, setCommentsForPost } = useCommentStore();
  const { isDialogOpen, openDialog, closeDialog } = useDialogStore();

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return; // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const commentsData = await fetchPostComments(postId);
      setCommentsForPost(postId, commentsData);
    } catch (error) {
      console.error('댓글 가져오기 오류:', error);
    }
  };

  // 게시물 상세 보기
  const openPostDetail = (post: any) => {
    setSelectedPost(post);
    fetchComments(post.id);
    openDialog(DIALOG_KEYS.POST_DETAIL);
  };

  return {
    selectedPost,
    isDialogOpen: isDialogOpen(DIALOG_KEYS.POST_DETAIL),
    closeDialog: () => closeDialog(DIALOG_KEYS.POST_DETAIL),
    fetchComments,
    openPostDetail,
  };
};
