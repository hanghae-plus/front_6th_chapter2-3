import { create } from 'zustand';
import { CommentState } from './type';

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: {},
  selectedComment: null,
  newComment: { body: '', postId: null, userId: 1 },
  setComments: (comments) => set({ comments }),
  setSelectedComment: (selectedComment) => set({ selectedComment }),
  setNewComment: (newComment) => set({ newComment }),
  setCommentsForPost: (postId, comments) => {
    const state = get();
    set({ comments: { ...state.comments, [postId]: comments } });
  },
  addCommentToPost: (postId, comment) => {
    const state = get();
    const existingComments = state.comments[postId] || [];
    set({ comments: { ...state.comments, [postId]: [...existingComments, comment] } });
  },
  updateCommentInPost: (postId, commentId, updatedComment) => {
    const state = get();
    const postComments = state.comments[postId] || [];
    const updatedComments = postComments.map((comment) =>
      comment.id === commentId ? updatedComment : comment,
    );
    set({ comments: { ...state.comments, [postId]: updatedComments } });
  },
  removeCommentFromPost: (postId, commentId) => {
    const state = get();
    const postComments = state.comments[postId] || [];
    const filteredComments = postComments.filter((comment) => comment.id !== commentId);
    set({ comments: { ...state.comments, [postId]: filteredComments } });
  },
}));
