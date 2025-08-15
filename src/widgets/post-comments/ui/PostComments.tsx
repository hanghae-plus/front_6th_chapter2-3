import { useFetchComments } from '@/entities/comment/model/useComments';
import { CommentList } from '@/entities/comment/ui/CommentList';
import {
  CreateCommentButton,
  DeleteCommentButton,
  EditCommentButton,
  LikeCommentButton,
  useViewPostStore,
} from '@/features';

export const PostComments = () => {
  const { postToView } = useViewPostStore();

  const { data: comments, isLoading } = useFetchComments(postToView?.id || null);

  if (isLoading) return <div>댓글 로딩 중...</div>;

  if (!comments) return null;

  return (
    <div className='mt-2'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='text-sm font-semibold'>댓글</h3>
        <CreateCommentButton />
      </div>
      <CommentList
        comments={comments}
        renderActions={(comment) => (
          <>
            <LikeCommentButton comment={comment} />
            <EditCommentButton comment={comment} />
            <DeleteCommentButton commentId={comment.id} />
          </>
        )}
      />
    </div>
  );
};
