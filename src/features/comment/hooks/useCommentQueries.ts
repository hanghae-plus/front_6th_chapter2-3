import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NewComment } from '../../../entities/comment';
import * as commentAPI from '../../../entities/comment/api';

// 댓글 목록 조회
export const useComments = (postId: number) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      // 실제 API 호출하여 댓글 데이터 가져오기
      return await commentAPI.fetchComments(postId);
    },
    enabled: !!postId,
  });
};

// 댓글 추가
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: NewComment) => {
      return await commentAPI.addComment(comment);
    },
    onSuccess: (data: any, variables: NewComment) => {
      const postId = data.postId || variables.postId;

      if (postId) {
        const existingData = queryClient.getQueryData(['comments', postId]);
        if (existingData && (existingData as any).comments) {
          const updatedComments = [...(existingData as any).comments, data];
          queryClient.setQueryData(['comments', postId], {
            ...existingData,
            comments: updatedComments,
          });
        } else {
          queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        }
      }
    },
  });
};

// 댓글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: string }) => {
      return { id, body, postId: null }; // 가짜 성공 응답
    },
    onSuccess: (data: any, variables: { id: number; body: string }) => {
      // data.postId가 있으면 해당 게시글의 댓글만 업데이트
      if (data && data.postId) {
        const existingData = queryClient.getQueryData(['comments', data.postId]);
        if (existingData && (existingData as any).comments) {
          const updatedComments = (existingData as any).comments.map((comment: any) =>
            comment.id === data.id ? data : comment,
          );

          queryClient.setQueryData(['comments', data.postId], {
            ...existingData,
            comments: updatedComments,
          });
        }
      } else {
        // postId가 없으면 모든 comments 쿼리에서 해당 댓글을 찾아서 업데이트
        const queries = queryClient.getQueriesData({ queryKey: ['comments'], exact: false });
        queries.forEach(([queryKey, queryData]) => {
          if (queryData && (queryData as any).comments) {
            const updatedComments = (queryData as any).comments.map((comment: any) =>
              comment.id === variables.id ? { ...comment, body: variables.body } : comment,
            );

            queryClient.setQueryData(queryKey, {
              ...queryData,
              comments: updatedComments,
            });
          }
        });
      }
    },
  });
};

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return { id, postId: null }; // 가짜 성공 응답
    },
    onSuccess: (data: any, variables: number) => {
      // data.postId가 있으면 해당 게시글의 댓글만 삭제
      if (data && data.postId) {
        const existingData = queryClient.getQueryData(['comments', data.postId]);
        if (existingData && (existingData as any).comments) {
          const filteredComments = (existingData as any).comments.filter(
            (comment: any) => comment.id !== data.id,
          );

          queryClient.setQueryData(['comments', data.postId], {
            ...existingData,
            comments: filteredComments,
          });
        }
      } else {
        // postId가 없으면 모든 comments 쿼리에서 해당 댓글을 찾아서 삭제
        const queries = queryClient.getQueriesData({ queryKey: ['comments'], exact: false });
        queries.forEach(([queryKey, queryData]) => {
          if (queryData && (queryData as any).comments) {
            const filteredComments = (queryData as any).comments.filter(
              (comment: any) => comment.id !== variables,
            );

            queryClient.setQueryData(queryKey, {
              ...queryData,
              comments: filteredComments,
            });
          }
        });
      }
    },
  });
};

// 댓글 좋아요
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, likes }: { id: number; likes: number }) => {
      return { id, likes: likes + 1, postId: null }; // 가짜 성공 응답
    },
    onSuccess: (data: any, variables: { id: number; likes: number }) => {
      // data.postId가 있으면 해당 게시글의 댓글만 업데이트
      if (data && data.postId) {
        const existingData = queryClient.getQueryData(['comments', data.postId]);
        if (existingData && (existingData as any).comments) {
          const updatedComments = (existingData as any).comments.map((comment: any) =>
            comment.id === data.id ? { ...comment, likes: comment.likes + 1 } : comment,
          );

          queryClient.setQueryData(['comments', data.postId], {
            ...existingData,
            comments: updatedComments,
          });
        }
      } else {
        // postId가 없으면 모든 comments 쿼리에서 해당 댓글을 찾아서 업데이트
        const queries = queryClient.getQueriesData({ queryKey: ['comments'], exact: false });
        queries.forEach(([queryKey, queryData]) => {
          if (queryData && (queryData as any).comments) {
            const updatedComments = (queryData as any).comments.map((comment: any) => {
              if (comment.id === variables.id) {
                // 현재 likes 값이 유효하지 않으면 1로 설정, 유효하면 +1
                const currentLikes = comment.likes;
                const newLikes =
                  currentLikes && !isNaN(currentLikes) && currentLikes >= 0 ? currentLikes + 1 : 1;
                return { ...comment, likes: newLikes };
              }
              return comment;
            });

            queryClient.setQueryData(queryKey, {
              ...queryData,
              comments: updatedComments,
            });
          }
        });
      }
    },
  });
};
