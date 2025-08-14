import { ReactNode, useMemo } from 'react';
import type { Post } from '@/entities/post';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui';

type PostDetailDialogProps = {
  open: boolean;
  post: Post | null;
  searchQuery?: string;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode; // 댓글 영역 등 외부에서 주입
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
  children,
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
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
