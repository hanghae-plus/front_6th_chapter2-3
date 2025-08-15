import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, NewComment } from '../../../entities/comment';
import * as commentAPI from '../../../entities/comment/api';

// 댓글 목록 조회
export const useComments = (postId: number) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const data = await commentAPI.fetchComments(postId);
      return data;
    },
    enabled: !!postId,
  });
};

// 댓글 추가
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment: NewComment) => {
      const data = await commentAPI.addComment(newComment);
      return data;
    },
    onSuccess: (data: any, variables: NewComment) => {
      console.log('useAddComment onSuccess:', { data, variables });

      // variables.postId를 사용하여 해당 게시글의 댓글 쿼리 직접 업데이트
      if (variables.postId) {
        console.log('댓글 쿼리 직접 업데이트:', ['comments', variables.postId]);

        // 기존 댓글 데이터 가져오기
        const existingData = queryClient.getQueryData(['comments', variables.postId]);
        console.log('기존 댓글 데이터:', existingData);

        if (existingData && (existingData as any).comments) {
          // 새 댓글을 기존 댓글 목록에 추가
          const updatedData = {
            ...existingData,
            comments: [data, ...(existingData as any).comments],
          };

          console.log('업데이트된 댓글 데이터:', updatedData);

          // 캐시 직접 업데이트
          queryClient.setQueryData(['comments', variables.postId], updatedData);
        } else {
          // 기존 데이터가 없으면 쿼리 무효화
          console.log('기존 데이터 없음, 쿼리 무효화');
          queryClient.invalidateQueries({
            queryKey: ['comments', variables.postId],
            exact: true,
          });
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
      return await commentAPI.updateComment(id, body);
    },
    onSuccess: (data: any, variables: { id: number; body: string }) => {
      console.log('useUpdateComment onSuccess:', { data, variables });

      // postId가 필요하므로 data에서 가져오거나 다른 방법 필요
      // 임시로 모든 comments 쿼리를 무효화
      queryClient.invalidateQueries({
        queryKey: ['comments'],
        exact: false,
      });
    },
  });
};

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await commentAPI.deleteComment(id);
    },
    onSuccess: (data: any, variables: number) => {
      console.log('useDeleteComment onSuccess:', { data, variables });

      // postId가 필요하므로 data에서 가져오거나 다른 방법 필요
      // 임시로 모든 comments 쿼리를 무효화
      queryClient.invalidateQueries({
        queryKey: ['comments'],
        exact: false,
      });
    },
  });
};

// 댓글 좋아요
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, likes }: { id: number; likes: number }) => {
      return await commentAPI.likeComment(id, likes);
    },
    onSuccess: (data: any, variables: { id: number; likes: number }) => {
      console.log('useLikeComment onSuccess:', { data, variables });

      // postId가 필요하므로 data에서 가져오거나 다른 방법 필요
      // 임시로 모든 comments 쿼리를 무효화
      queryClient.invalidateQueries({
        queryKey: ['comments'],
        exact: false,
      });
    },
  });
};
