export interface AddCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newComment: {
    body: string;
    postId: number | null;
    userId: number;
  };
  onCommentChange: (comment: { body: string; postId: number | null; userId: number }) => void;
  onSubmit: () => void;
}
