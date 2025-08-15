export interface AddCommentDialogProps {
  newComment: {
    body: string;
    postId: number | null;
    userId: number;
  };
  onCommentChange: (comment: { body: string; postId: number | null; userId: number }) => void;
  onSubmit: () => void;
}
