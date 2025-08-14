import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePostsStore } from '../../../../entities/post/model/store';
import { useDialogStore } from '../../../../shared/store/dialog';
import { updatePostAPI } from '../api/api';
import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { Posts } from '../../../../entities/post/model/type';

export const useEditPost = () => {
  const queryClient = useQueryClient();
  const { selectedPost: storeSelectedPost, updatePost: updatePostInStore } = usePostsStore();
  const { closeDialog } = useDialogStore();
  const [selectedPost, setSelectedPost] = useState<Posts | null>(storeSelectedPost);

  useEffect(() => {
    setSelectedPost(storeSelectedPost);
  }, [storeSelectedPost]);

  const updatePostMutation = useMutation({
    mutationFn: async (postData: Posts) => {
      if (!postData) throw new Error('게시물 데이터가 없습니다');

      // 서버에 업데이트 요청
      const result = await updatePostAPI(postData);
      return result;
    },
    onSuccess: (result) => {
      // 로컬 상태에 즉시 반영
      if (selectedPost) {
        updatePostInStore(selectedPost);
      }

      // React Query 캐시 무효화 (posts 관련 쿼리가 있다면)
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', selectedPost?.id] });

      // 다이얼로그 닫기
      closeDialog(DIALOG_KEYS.EDIT_POST);
    },
    onError: (error) => {
      console.error('게시물 업데이트 오류:', error);
      // 에러 토스트나 알림 표시 가능
    },
  });

  const updatePost = () => {
    if (!selectedPost) return;
    updatePostMutation.mutate(selectedPost);
  };

  return {
    selectedPost,
    setSelectedPost,
    updatePost,
    isLoading: updatePostMutation.isPending,
    isError: updatePostMutation.isError,
    error: updatePostMutation.error,
    isSuccess: updatePostMutation.isSuccess,
  };
};
