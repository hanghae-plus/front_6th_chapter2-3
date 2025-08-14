import { create } from 'zustand';
import type { Post, PostComment } from '@/entities/posts';

interface AddComment {
  postId: number;
  userId: number;
}

interface AddCommentDialogState {
  opened: boolean;
  data: AddComment | null;
  open: (data: AddComment) => void;
  close: () => void;
}

// 댓글 추가 다이얼로그
export const useAddCommentDialog = create<AddCommentDialogState>((set) => {
  return {
    opened: false,
    data: null,
    open: (data: AddComment) => {
      set({ opened: true, data });
    },
    close: () => {
      set({ opened: false, data: null });
    },
  };
});

interface AddPostDialogState {
  opened: boolean;
  open: () => void;
  close: () => void;
}

// 게시물 추가 다이얼로그
export const useAddPostDialog = create<AddPostDialogState>((set) => {
  return {
    opened: false,
    open: () => {
      set({ opened: true });
    },
    close: () => {
      set({ opened: false });
    },
  };
});

interface EditCommentDialogState {
  opened: boolean;
  data: PostComment | null;
  open: (data: PostComment) => void;
  close: () => void;
}

// 댓글 수정 다이얼로그
export const useEditCommentDialog = create<EditCommentDialogState>((set) => {
  return {
    opened: false,
    data: null,
    open: (data: PostComment) => {
      set({ opened: true, data });
    },
    close: () => {
      set({ opened: false, data: null });
    },
  };
});

interface EditPostDialogState {
  opened: boolean;
  data: Post | null;
  open: (data: Post) => void;
  close: () => void;
}

// 게시물 수정 다이얼로그
export const useEditPostDialog = create<EditPostDialogState>((set) => {
  return {
    opened: false,
    data: null,
    open: (data: Post) => {
      set({ opened: true, data });
    },
    close: () => {
      set({ opened: false, data: null });
    },
  };
});

interface PostDialogState {
  opened: boolean;
  data: Post | null;
  open: (data: Post) => void;
  close: () => void;
}

// 게시물 상세 보기 다이얼로그
export const usePostDialog = create<PostDialogState>((set) => {
  return {
    opened: false,
    data: null,
    open: (data: Post) => {
      set({ opened: true, data });
    },
    close: () => {
      set({ opened: false, data: null });
    },
  };
});
