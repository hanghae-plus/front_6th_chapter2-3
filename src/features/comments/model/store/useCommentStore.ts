import { create } from 'zustand';
import {
  Comments,
  PostAddComment,
} from '../../../../entities/comments/model/types.ts';

interface CommentState {
  selectedComment: Comments | null;
  showAddCommentDialog: boolean;
  showEditCommentDialog: boolean;
  newComment: PostAddComment;
  setSelectedComment: (comment: Comments | null) => void;
  setShowAddCommentDialog: (show: boolean) => void;
  setShowEditCommentDialog: (show: boolean) => void;
  setNewComment: (comment: PostAddComment) => void;
  resetNewComment: () => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  selectedComment: null,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  newComment: { body: '', postId: 0, userId: 1 },
  setSelectedComment: (comment) => set({ selectedComment: comment }),
  setShowAddCommentDialog: (show) => set({ showAddCommentDialog: show }),
  setShowEditCommentDialog: (show) => set({ showEditCommentDialog: show }),
  setNewComment: (comment) => set({ newComment: comment }),
  resetNewComment: () =>
    set({ newComment: { body: '', postId: 0, userId: 1 } }),
}));
