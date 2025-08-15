import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import type { Post } from '@/entities/post';
import type { Comment } from '@/entities/comment';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from '@/shared/ui';
import { CommentList } from '@/features/(comment)/list-comments';

type PostDetailDialogProps = {
  open: boolean;
  post: Post | null;
  searchQuery?: string;
  onOpenChange: (open: boolean) => void;
  commentsFeature: {
    comments: Comment[];
    refetch: () => void;
  };
  onAddComment: () => void;
  onEditComment: (comment: Comment) => void;
  onDeleteComment: (id: number) => void;
  onLikeComment: (id: number) => void;
};

function useHighlight(text: string | undefined, highlight: string | undefined) {
  return useMemo(() => {
    if (!text) return null;
    if (!highlight || !highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
        )}
      </span>
    );
  }, [text, highlight]);
}

export function PostDetailDialog({
  open,
  post,
  searchQuery,
  onOpenChange,
  commentsFeature,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: PostDetailDialogProps) {
  const highlightedTitle = useHighlight(post?.title, searchQuery);
  const highlightedBody = useHighlight(post?.body, searchQuery);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{highlightedTitle}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>{highlightedBody}</p>
          {post ? (
            <div className='mt-2'>
              <div className='flex items-center justify-between mb-2'>
                <h3 className='text-sm font-semibold'>댓글</h3>
                <Button size='sm' onClick={onAddComment}>
                  <Plus className='w-3 h-3 mr-1' />
                  댓글 추가
                </Button>
              </div>
              <CommentList
                comments={commentsFeature.comments}
                onLike={onLikeComment}
                onEdit={onEditComment}
                onDelete={onDeleteComment}
              />
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
