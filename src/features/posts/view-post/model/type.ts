import { JSX } from 'react';

export interface PostDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPost: any | null;
  searchQuery: string;
  highlightText: (text: string, highlight: string) => JSX.Element | null;
  renderComments: (postId: number) => JSX.Element;
}
