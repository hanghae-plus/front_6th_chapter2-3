import { create } from 'zustand';

import { Comment, CreateComment } from '../../../entities/comment';

interface CommentState {
  comments: Record<number, Comment[]>;
  loading: boolean;
  selectedComment: Comment | null;
  newComment: CreateComment;
  showAddCommentDialog: boolean;
  showEditCommentDialog: boolean;
}

interface CommentActions {
  // Comment CRUD
  setComments: (postId: number, comments: Comment[]) => void;
  addCommentToPost: (postId: number, comment: Comment) => void;
  updateCommentInPost: (
    postId: number,
    commentId: number,
    updatedComment: Partial<Comment>
  ) => void;
  removeCommentFromPost: (postId: number, commentId: number) => void;

  // Dialog state
  setShowAddCommentDialog: (show: boolean) => void;
  setShowEditCommentDialog: (show: boolean) => void;
  setSelectedComment: (comment: Comment | null) => void;

  // Form state
  setNewComment: (comment: CreateComment) => void;
  resetNewComment: () => void;

  // Loading state
  setLoading: (loading: boolean) => void;
}

export const useCommentState = create<CommentState & CommentActions>(
  (set, get) => ({
    comments: {},
    loading: false,
    selectedComment: null,
    newComment: { body: '', postId: null, userId: 1 },
    showAddCommentDialog: false,
    showEditCommentDialog: false,

    // Comment CRUD actions
    setComments: (postId: number, comments: Comment[]) =>
      set(state => ({
        comments: { ...state.comments, [postId]: comments },
      })),

    addCommentToPost: (postId: number, comment: Comment) =>
      set(state => ({
        comments: {
          ...state.comments,
          [postId]: [...(state.comments[postId] || []), comment],
        },
      })),

    updateCommentInPost: (
      postId: number,
      commentId: number,
      updatedComment: Partial<Comment>
    ) =>
      set(state => ({
        comments: {
          ...state.comments,
          [postId]:
            state.comments[postId]?.map(comment =>
              comment.id === commentId
                ? { ...comment, ...updatedComment }
                : comment
            ) || [],
        },
      })),

    removeCommentFromPost: (postId: number, commentId: number) =>
      set(state => ({
        comments: {
          ...state.comments,
          [postId]:
            state.comments[postId]?.filter(
              comment => comment.id !== commentId
            ) || [],
        },
      })),

    // Dialog actions
    setShowAddCommentDialog: (show: boolean) =>
      set({ showAddCommentDialog: show }),
    setShowEditCommentDialog: (show: boolean) =>
      set({ showEditCommentDialog: show }),
    setSelectedComment: (comment: Comment | null) =>
      set({ selectedComment: comment }),

    // Form actions
    setNewComment: (comment: CreateComment) => set({ newComment: comment }),
    resetNewComment: () =>
      set({ newComment: { body: '', postId: null, userId: 1 } }),

    // Loading actions
    setLoading: (loading: boolean) => set({ loading }),
  })
);
