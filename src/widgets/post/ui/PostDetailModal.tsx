import { useSearchParams } from 'react-router-dom';

import { useCommentListQuery } from '../../../entities';
import {
  CreateCommentButton,
  DeleteCommentButton,
  LikeCommentButton,
  UpdateCommentButton,
} from '../../../features';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  highlightText,
  useModal,
} from '../../../shared';

export const PostDetailModal = () => {
  const { selectedPost, showPostDetailDialog, closePostDetail } = useModal();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const { data } = useCommentListQuery(selectedPost?.id ?? 0, !!selectedPost);
  const comments = data?.comments || [];

  if (!selectedPost) return null;

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={closePostDetail}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost.title, searchQuery)}</DialogTitle>
          <DialogDescription>게시물의 상세 내용과 댓글을 확인할 수 있습니다.</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <p>{highlightText(selectedPost.body, searchQuery)}</p>
          <div className='mt-2'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-semibold'>댓글</h3>
              <CreateCommentButton postId={selectedPost.id} />
            </div>
            <div className='space-y-1'>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className='flex items-center justify-between text-sm border-b pb-1'
                >
                  <div className='flex items-center space-x-2 overflow-hidden'>
                    <span className='font-medium truncate'>{comment.user.username}:</span>
                    <span className='truncate'>{highlightText(comment.body, searchQuery)}</span>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <LikeCommentButton
                      commentId={comment.id}
                      postId={selectedPost.id}
                      likes={comment.likes}
                    />
                    <UpdateCommentButton comment={comment} />
                    <DeleteCommentButton commentId={comment.id} postId={selectedPost.id} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
