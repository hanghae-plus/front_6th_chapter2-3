import { useFetchComments } from '@/entities/comment/model/useComments';
import { CommentList } from '@/entities/comment/ui/CommentList';
import { CreateCommentButton } from '@/features/comment-create/ui/CreateCommentButton';
import { DeleteCommentButton } from '@/features/comment-delete/ui/DeleteCommentButton';
import { EditCommentButton } from '@/features/comment-edit/ui/EditCommentButton';
import { LikeCommentButton } from '@/features/comment-like/ui/LikeCommentButton';
import { useViewPostStore } from '@/features/post-view/model/viewPostStore';

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
