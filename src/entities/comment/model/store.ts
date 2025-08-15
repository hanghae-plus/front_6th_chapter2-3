import { create } from "zustand";
import { PostCommentRequestType } from "@/entities/comment/model/types";

interface CommentDialogState {
  newComment: Partial<PostCommentRequestType>;
}

interface CommentDialogActions {
  setNewComment: (comment: Partial<PostCommentRequestType>) => void;
  resetNewComment: () => void;
}

export type CommentStore = CommentDialogState & CommentDialogActions;

const initialNewComment: Partial<PostCommentRequestType> = {
  body: "",
  postId: null,
  userId: 1,
};

export const useCommentStore = create<CommentStore>((set) => ({
  newComment: { ...initialNewComment },
  setNewComment: (comment) => set({ newComment: comment }),
  resetNewComment: () => set({ newComment: { ...initialNewComment } }),
}));
