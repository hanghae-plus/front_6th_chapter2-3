import { useCallback } from 'react';
import type { Post } from '@/entities/post';
import type { Comment } from '@/entities/comment';
import type { User } from '@/entities/user';
import { userApi } from '@/entities/user';
import { useDeletePost } from '@/features/(post)/delete-post';
import { AddPostDialog } from '@/features/(post)/add-post';
import { EditPostDialog } from '@/features/(post)/edit-post';
import { AddCommentDialog } from '@/features/(comment)/add-comment';
import { EditCommentDialog } from '@/features/(comment)/edit-comment';
import { PostDetailDialog } from '@/features/(post)/view-post-detail';
import { UserModal } from '@/features/(user)/view-user-modal';

type DialogActions = {
  open: (component: any, props: any) => void;
  close: (component: any) => void;
};

type CommentFeature = {
  refetch: () => void;
  remove: (id: number) => Promise<void>;
  like: (id: number) => Promise<void>;
};

export function useDialogHandlers(
  dialogActions: DialogActions,
  selectedPost: Post | null,
  setSelectedPost: (post: Post | null) => void,
  commentsFeature: CommentFeature,
  searchQuery: string,
) {
  const { open, close } = dialogActions;
  const deletePostMutation = useDeletePost();

  // 포스트 관련 핸들러들
  const openAddPostDialog = useCallback(
    () =>
      open(AddPostDialog, {
        open: true,
        onOpenChange: () => close(AddPostDialog),
        onSuccess: () => close(AddPostDialog),
      }),
    [open, close],
  );

  const openEditPostDialog = useCallback(
    (post: Post) =>
      open(EditPostDialog, {
        open: true,
        onOpenChange: () => close(EditPostDialog),
        post,
        onSuccess: () => close(EditPostDialog),
      }),
    [open, close],
  );

  const onPostDeleted = useCallback(
    async (id: number) => {
      await deletePostMutation.mutateAsync(id);
    },
    [deletePostMutation],
  );

  // 댓글 관련 핸들러들
  const openAddCommentDialog = useCallback(
    () =>
      open(AddCommentDialog, {
        open: true,
        onOpenChange: () => close(AddCommentDialog),
        postId: selectedPost?.id ?? null,
        onSuccess: () => void commentsFeature.refetch(),
      }),
    [open, close, selectedPost?.id, commentsFeature],
  );

  const openEditCommentDialog = useCallback(
    (comment: Comment) =>
      open(EditCommentDialog, {
        open: true,
        onOpenChange: () => close(EditCommentDialog),
        comment,
        onSuccess: () => void commentsFeature.refetch(),
      }),
    [open, close, commentsFeature],
  );

  const deleteComment = useCallback(
    async (id: number) => {
      try {
        await commentsFeature.remove(id);
      } catch (error) {
        console.error('댓글 삭제 오류:', error);
      }
    },
    [commentsFeature],
  );

  const likeComment = useCallback(
    async (id: number) => {
      try {
        await commentsFeature.like(id);
      } catch (error) {
        console.error('댓글 좋아요 오류:', error);
      }
    },
    [commentsFeature],
  );

  // 포스트 상세 다이얼로그
  const openPostDetail = useCallback(
    (post: Post) => {
      setSelectedPost(post);
      open(PostDetailDialog, {
        open: true,
        onOpenChange: () => {
          close(PostDetailDialog);
          setSelectedPost(null);
        },
        post,
        searchQuery: searchQuery || '',
        commentsFeature,
        onAddComment: openAddCommentDialog,
        onEditComment: openEditCommentDialog,
        onDeleteComment: deleteComment,
        onLikeComment: likeComment,
      });
    },
    [
      setSelectedPost,
      open,
      close,
      searchQuery,
      commentsFeature,
      openAddCommentDialog,
      openEditCommentDialog,
      deleteComment,
      likeComment,
    ],
  );

  // 사용자 모달
  const openUserModal = useCallback(
    async (user: User) => {
      if (!user?.id) return;

      try {
        const userData = await userApi.getUserById(user.id);
        open(UserModal, {
          open: true,
          onOpenChange: () => close(UserModal),
          user: userData,
        });
      } catch (error) {
        console.error('사용자 정보 로드 오류:', error);
      }
    },
    [open, close],
  );

  return {
    // 포스트 관련
    openAddPostDialog,
    openEditPostDialog,
    onPostDeleted,
    openPostDetail,

    // 댓글 관련
    openAddCommentDialog,
    openEditCommentDialog,
    deleteComment,
    likeComment,

    // 사용자 관련
    openUserModal,
  };
}
