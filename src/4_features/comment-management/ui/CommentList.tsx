import { useGetCommentsQuery } from '@/entities/comment';
import { useUIStore } from '@/shared/lib';
import { LoadingSpinner } from '@/shared/ui';

import { CommentItem } from './CommentItem';

export const CommentList = () => {
  const { selectedPost } = useUIStore();
  const { data: commentsData, isLoading } = useGetCommentsQuery(
    selectedPost?.id ?? null
  );

  return (
    <div className='space-y-1 w-full'>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        commentsData?.comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
};
