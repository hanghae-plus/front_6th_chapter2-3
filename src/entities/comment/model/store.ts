import { create } from 'zustand';
import { CommentState } from './type';

export const useCommentStore = create<CommentState>((set) => ({
  comments: {},
  selectedComment: null,
  newComment: { body: '', postId: null, userId: 1 },
  setComments: (comments) => set({ comments }),
  setSelectedComment: (selectedComment) => set({ selectedComment }),
  setNewComment: (newComment) => set({ newComment }),
}));
