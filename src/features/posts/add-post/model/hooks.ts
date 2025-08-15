import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDialogStore } from '../../../../shared/store/dialog';
import { addPostAPI } from '../api/api';
import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { usePostsStore } from '../../../../entities/post/model/store';
import { fetchUserBasic } from '../../../../entities/user/api/api';

export const useAddPost = () => {
  const queryClient = useQueryClient();
  const { closeDialog } = useDialogStore();
  const { addPost: addPostToStore } = usePostsStore();
  const [newPost, setNewPost] = useState({ title: '', body: '', userId: 1 });

  const addPostMutation = useMutation({
    mutationFn: async (postData: { title: string; body: string; userId: number }) => {
      // 서버에 게시물 추가
      const result = await addPostAPI(postData);

      // 사용자 정보 가져오기
      const usersData = await fetchUserBasic();
      const author = usersData.users.find((user) => user.id === postData.userId);

      return {
        ...result,
        author,
        tags: [],
        reactions: { likes: 0, dislikes: 0 },
        views: 0,
      };
    },
    onSuccess: (postWithAuthor) => {
      // 로컬 상태에 즉시 추가
      addPostToStore(postWithAuthor);

      // React Query 캐시 무효화 (posts 관련 쿼리가 있다면)
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      // 다이얼로그 닫기 및 폼 초기화
      closeDialog(DIALOG_KEYS.ADD_POST);
      setNewPost({ title: '', body: '', userId: 1 });
    },
    onError: (error) => {
      console.error('게시물 추가 오류:', error);
      // 여기서 에러 토스트나 알림을 보여줄 수 있음
    },
  });

  const addPost = () => {
    addPostMutation.mutate(newPost);
  };

  return {
    newPost,
    setNewPost,
    addPost,
    isLoading: addPostMutation.isPending,
    isError: addPostMutation.isError,
    error: addPostMutation.error,
    isSuccess: addPostMutation.isSuccess,
  };
};
