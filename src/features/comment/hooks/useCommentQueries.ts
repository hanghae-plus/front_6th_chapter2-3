import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NewComment } from '../../../entities/comment';

// 댓글 목록 조회
export const useComments = (postId: number) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      // API 호출을 하지 않고 빈 데이터 반환 (실제로는 사용되지 않음)
      return { comments: [], total: 0, skip: 0, limit: 0 };
    },
    enabled: !!postId,
  });
};

// 댓글 추가
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: NewComment) => {
      // API 호출을 하지 않고 바로 성공 응답 반환
      console.log('댓글 추가 - API 호출 없이 UI만 업데이트');
      return { ...comment, id: Date.now() }; // 가짜 성공 응답
    },
    onSuccess: (data: any, variables: NewComment) => {
      console.log('useAddComment onSuccess:', { data, variables });
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
      // API 호출을 하지 않고 바로 성공 응답 반환
      console.log('댓글 수정 - API 호출 없이 UI만 업데이트');
      return { id, body, postId: null }; // 가짜 성공 응답
    },
    onSuccess: (data: any, variables: { id: number; body: string }) => {
      console.log('useUpdateComment onSuccess:', { data, variables });

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
      // API 호출을 하지 않고 바로 성공 응답 반환
      console.log('댓글 삭제 - API 호출 없이 UI만 업데이트');
      return { id, postId: null }; // 가짜 성공 응답
    },
    onSuccess: (data: any, variables: number) => {
      console.log('useDeleteComment onSuccess:', { data, variables });

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
      // API 호출을 하지 않고 바로 성공 응답 반환
      console.log('댓글 좋아요 - API 호출 없이 UI만 업데이트');

      // likes 값이 유효하지 않으면 1로 설정, 유효하면 +1
      const newLikes = likes && !isNaN(likes) && likes >= 0 ? likes + 1 : 1;

      return { id, likes: newLikes, postId: null }; // 가짜 성공 응답
    },
    onSuccess: (data: any, variables: { id: number; likes: number }) => {
      console.log('useLikeComment onSuccess:', { data, variables });

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
