import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "./commentApi";
import { commentQueryKeys } from "./queryKeys";
import {
  CommentType,
  DeleteCommentRequestType,
  GetCommentsResponseType,
  LikeCommentRequestType,
  PostCommentRequestType,
  PutCommentRequestType,
} from "../model/types";

// 댓글 목록 조회
export const useGetCommentsQuery = (postId: number) => {
  return useQuery({
    queryKey: commentQueryKeys.list(postId),
    queryFn: () => commentApi.getComments(postId),
    enabled: !!postId,
  });
};

// 댓글 추가
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PostCommentRequestType) => {
      return commentApi.createComment(req);
    },
    onSuccess: (res) => {
      const commentWithLikes = {
        ...res,
        likes: 0,
      };

      queryClient.setQueryData(
        commentQueryKeys.list(res.postId),
        (old: GetCommentsResponseType) => {
          if (!old) return old;

          const newData = {
            ...old,
            comments: [commentWithLikes, ...old.comments],
            total: old.total + 1,
          };
          return newData;
        },
      );
    },
    onError: (error, req) => {
      console.error("댓글 추가 실패:", error);
      if (req.postId) {
        queryClient.invalidateQueries({
          queryKey: commentQueryKeys.list(req.postId),
        });
      }
    },
  });
};

// 댓글 수정
export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: PutCommentRequestType) => {
      return commentApi.updateComment(req.id, { body: req.body });
    },
    onSuccess: (updatedComment) => {
      queryClient.setQueryData(
        commentQueryKeys.list(updatedComment.postId),
        (old: GetCommentsResponseType) => {
          if (!old) return old;
          const newData = {
            ...old,
            comments: old.comments.map((comment: CommentType) =>
              comment.id === updatedComment.id ? updatedComment : comment,
            ),
          };
          return newData;
        },
      );
    },
    onError: (error) => {
      console.error("댓글 수정 실패:", error);
    },
  });
};

// 댓글 삭제
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: DeleteCommentRequestType) => {
      return commentApi.deleteComment(req.id);
    },
    onSuccess: (_, req) => {
      queryClient.setQueryData(
        commentQueryKeys.list(req.postId),
        (old: GetCommentsResponseType) => {
          if (!old) return old;
          const newData = {
            ...old,
            comments: old.comments.filter(
              (comment: CommentType) => comment.id !== req.id,
            ),
            total: old.total - 1,
          };
          return newData;
        },
      );
    },
    onError: (error, req) => {
      console.error("댓글 삭제 실패:", error);
      queryClient.invalidateQueries({
        queryKey: commentQueryKeys.list(req.postId),
      });
    },
  });
};

// 댓글 좋아요
export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: LikeCommentRequestType) => {
      const newLikes = req.currentLikes + 1;

      try {
        await commentApi.likeComment(req.id, req.currentLikes);
      } catch (error) {
        console.warn("서버 좋아요 요청 실패, 클라이언트에서만 처리:", error);
      }

      return { id: req.id, postId: req.postId, likes: newLikes };
    },
    onSuccess: (res, req) => {
      queryClient.setQueryData(
        commentQueryKeys.list(req.postId),
        (old: GetCommentsResponseType) => {
          if (!old) return old;
          const newData = {
            ...old,
            comments: old.comments.map((comment: CommentType) =>
              comment.id === req.id
                ? { ...comment, likes: res.likes }
                : comment,
            ),
          };
          return newData;
        },
      );
    },
  });
};
