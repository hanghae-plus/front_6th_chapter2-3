import { JSX } from 'react';

export interface PostDetailDialogProps {
  selectedPost: any | null;
  searchQuery: string;
  highlightText: (text: string, highlight: string) => JSX.Element | null;
  renderComments: (postId: number) => JSX.Element;
}
