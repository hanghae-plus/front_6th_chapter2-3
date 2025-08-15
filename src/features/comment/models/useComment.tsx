import { useCallback, useState } from "react";
import type { Comment as CommentType } from "../../../entities/comment/models/types";

import {
  useEnsureCommentsByPost,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} from "../../../entities/comment/models/queries";

type PostId = number;
type CommentId = number;
type CommentsState = Record<PostId, CommentType[]>;
type UIOptions = {
  newComment: Partial<CommentType>;
  setNewComment: React.Dispatch<React.SetStateAction<Partial<CommentType>>>;
  selectedComment: CommentType | null;

  setShowAddCommentDialog?: (open: boolean) => void;
  setShowEditCommentDialog?: (open: boolean) => void;
};

export function useComments({
  newComment,
  setNewComment,
  selectedComment,
  setShowAddCommentDialog,
  setShowEditCommentDialog,
}: UIOptions) {
  const [comments, setComments] = useState<CommentsState>({});

  const ensureCommentsByPost = useEnsureCommentsByPost();
  const addMutation = useAddCommentMutation();
  const updateMutation = useUpdateCommentMutation();
  const deleteMutation = useDeleteCommentMutation();
  const likeMutation = useLikeCommentMutation();

  const fetchComments = useCallback(
    async (postId: PostId) => {
      if (comments[postId]) return;
      try {
        const data = await ensureCommentsByPost(postId);
        setComments((prev) => ({ ...prev, [postId]: data.comments ?? [] }));
      } catch (error) {
        console.error("댓글 가져오기 오류:", error);
      }
    },
    [comments, ensureCommentsByPost],
  );

  const handleAddComment = useCallback(async () => {
    try {
      const { body, postId, userId } = newComment;
      if (!body || !postId || !userId) return;

      const created = await addMutation.mutateAsync({
        comment: { body, postId, userId },
      });

      const normalized: CommentType = { likes: 0, ...(created as CommentType) };

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] ?? []), normalized],
      }));

      setShowAddCommentDialog?.(false);
      setNewComment({ body: "", postId: null, userId: 1 });
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
  }, [newComment, setNewComment, setShowAddCommentDialog, addMutation]);

  const handleUpdateComment = useCallback(async () => {
    try {
      if (!selectedComment) return;

      setComments((prev) => {
        const list = prev[selectedComment.postId ?? 0] ?? [];
        return {
          ...prev,
          [selectedComment.postId ?? 0]: list.map((c) => (c.id === selectedComment.id ? selectedComment : c)),
        };
      });

      const saved = await updateMutation.mutateAsync({ comment: selectedComment });

      setComments((prev) => {
        const list = prev[saved.postId ?? 0] ?? [];
        return {
          ...prev,
          [saved.postId ?? 0]: list.map((c) => (c.id === saved.id ? saved : c)),
        };
      });

      setShowEditCommentDialog?.(false);
    } catch (error) {
      console.error("댓글 업데이트 오류:", error);
    }
  }, [selectedComment, setShowEditCommentDialog, updateMutation]);

  const handleDeleteComment = useCallback(
    async (id: CommentId, postId: PostId) => {
      try {
        setComments((prev) => ({
          ...prev,
          [postId]: (prev[postId] ?? []).filter((c) => c.id !== id),
        }));

        await deleteMutation.mutateAsync({ id, postId });
      } catch (error) {
        console.error("댓글 삭제 오류:", error);
      }
    },
    [deleteMutation],
  );

  const handleLikeComment = useCallback(
    async (id: CommentId, postId: PostId) => {
      try {
        const current = comments[postId]?.find((c) => c.id === id);
        if (!current) return;

        const nextLikes = (current.likes ?? 0) + 1;

        setComments((prev) => ({
          ...prev,
          [postId]: (prev[postId] ?? []).map((c) => (c.id === id ? { ...c, likes: nextLikes } : c)),
        }));

        const updated = await likeMutation.mutateAsync({ id, likes: nextLikes, postId });

        setComments((prev) => ({
          ...prev,
          [postId]: (prev[postId] ?? []).map((c) => (c.id === id ? { ...updated, likes: nextLikes } : c)),
        }));
      } catch (error) {
        console.error("댓글 좋아요 오류:", error);
      }
    },
    [comments, likeMutation],
  );

  return {
    comments,
    fetchComments,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
  };
}
