import { useCallback, useState } from "react";
import {
  addComment as addCommentApi,
  deleteComment as deleteCommentApi,
  getComments as getCommentsApi,
  likeComment as likeCommentApi,
  updateComment as updateCommentApi,
} from "../../../entities/comment/api";
import type { Comment as CommentType } from "../../../entities/comment/types";

type PostId = number;
type CommentId = number;
type CommentsState = Record<PostId, CommentType[]>;
type UIOptions = {
  // 기존 PostsManager의 UI 상태/세터를 그대로 넘겨 받아 동일 동작 유지
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

  /** 기존: fetchComments(postId) */
  const fetchComments = useCallback(
    async (postId: PostId) => {
      if (comments[postId]) return; // 이미 불러온 경우 재요청 방지(기존 로직 유지)
      try {
        const data = await getCommentsApi({ postId });
        setComments((prev) => ({ ...prev, [postId]: data.comments ?? [] }));
      } catch (error) {
        console.error("댓글 가져오기 오류:", error);
      }
    },
    [comments],
  );

  /** 기존: handleAddComment() */
  const handleAddComment = useCallback(async () => {
    try {
      const { body, postId, userId } = newComment;
      if (!body || !postId || !userId) return;

      const created = await addCommentApi({
        comment: { body, postId, userId },
      });

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] ?? []), created],
      }));

      // 기존 동작 유지: 다이얼로그 닫고 입력 초기화
      setShowAddCommentDialog?.(false);
      setNewComment({ body: "", postId: null, userId: 1 });
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
  }, [newComment, setNewComment, setShowAddCommentDialog]);

  /** 기존: handleUpdateComment() */
  const handleUpdateComment = useCallback(async () => {
    try {
      if (!selectedComment) return;

      // 낙관적 업데이트(기존 형태 유지하면서 내부 안정화)
      setComments((prev) => {
        const list = prev[selectedComment.postId ?? 0] ?? [];
        return {
          ...prev,
          [selectedComment.postId ?? 0]: list.map((c) => (c.id === selectedComment.id ? selectedComment : c)),
        };
      });

      const saved = await updateCommentApi({ comment: selectedComment });

      setComments((prev) => {
        const list = prev[saved.postId ?? 0] ?? [];
        return {
          ...prev,
          [saved.postId ?? 0]: list.map((c) => (c.id === saved.id ? saved : c)),
        };
      });

      // 기존 동작 유지: 다이얼로그 닫기
      setShowEditCommentDialog?.(false);
    } catch (error) {
      console.error("댓글 업데이트 오류:", error);
    }
  }, [selectedComment, setShowEditCommentDialog]);

  /** 기존: handleDeleteComment(id, postId) */
  const handleDeleteComment = useCallback(async (id: CommentId, postId: PostId) => {
    try {
      // 낙관적 제거
      setComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] ?? []).filter((c) => c.id !== id),
      }));

      await deleteCommentApi({ id });
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      // 실패 시 서버 소스라면 롤백 로직 추가 가능
      // (최소 변경 원칙상 생략)
    }
  }, []);

  /** 기존: handleLikeComment(id, postId) */
  const handleLikeComment = useCallback(
    async (id: CommentId, postId: PostId) => {
      try {
        // 현재 좋아요 수 확인
        const current = comments[postId]?.find((c) => c.id === id);
        if (!current) return;

        const nextLikes = (current.likes ?? 0) + 1;

        // 낙관적 증가
        setComments((prev) => ({
          ...prev,
          [postId]: (prev[postId] ?? []).map((c) => (c.id === id ? { ...c, likes: nextLikes } : c)),
        }));

        // 서버 업데이트 (기존 형태: likes + 1 전달)
        const updated = await likeCommentApi({ id, likes: nextLikes });

        // 서버 결과로 동기화
        setComments((prev) => ({
          ...prev,
          [postId]: (prev[postId] ?? []).map((c) => (c.id === id ? { ...updated, likes: nextLikes } : c)),
        }));
      } catch (error) {
        console.error("댓글 좋아요 오류:", error);
        // 실패 시 롤백을 원하시면 여기서 이전 값으로 되돌리는 처리 추가 가능
      }
    },
    [comments],
  );

  return {
    // state
    comments,

    // queries
    fetchComments,

    // mutations (시그니처/이름 그대로)
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
  };
}
