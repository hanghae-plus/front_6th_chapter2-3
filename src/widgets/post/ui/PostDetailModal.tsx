import { useSearchParams } from 'react-router-dom';

import { PostType, useCommentListQuery } from '../../../entities';
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
} from '../../../shared';

interface PostDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPost: PostType;
  postId: number;
}

export const PostDetailModal = ({
  isOpen,
  onOpenChange,
  selectedPost,
  postId,
}: PostDetailModalProps) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const { data } = useCommentListQuery(postId, true);
  const comments = data?.comments || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
          <DialogDescription>게시물의 상세 내용과 댓글을 확인할 수 있습니다.</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <p>{highlightText(selectedPost?.body, searchQuery)}</p>
          {/* {renderComments(selectedPost?.id)} */}
          <div className='mt-2'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-semibold'>댓글</h3>
              <CreateCommentButton postId={postId} />
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
                      postId={postId}
                      likes={comment.likes}
                    />
                    <UpdateCommentButton comment={comment} />
                    <DeleteCommentButton commentId={comment.id} postId={postId} />
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
