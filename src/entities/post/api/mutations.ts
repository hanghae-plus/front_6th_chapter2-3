import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PostPostRequestType, PutPostRequestType } from '../model';

import { putPost, deletePost, postPost } from './index';

// 게시물 생성
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: PostPostRequestType) => postPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('게시물 추가 오류:', error);
    },
  });
};

// 게시물 수정
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: PutPostRequestType) => putPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('게시물 업데이트 오류:', error);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      console.log("게시물 삭제 성공")
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('게시물 삭제 오류:', error);
    },
  });
};
