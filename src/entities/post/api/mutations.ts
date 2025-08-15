import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PostPostRequestType, PutPostRequestType } from '../model';

import { putPost, deletePost, postPost } from './index';

// 게시물 생성
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: PostPostRequestType) => postPost(post),
    onSuccess: (response) => {
      // 모든 게시물 쿼리 캐시를 업데이트
      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData?.posts) return oldData;

        // 새로운 게시물을 맨 첫 번째에 추가
        const newPost = {
          id: response.id || Date.now(), // 서버 응답 ID 또는 임시 ID
          title: response.title,
          body: response.body,
          userId: response.userId,
          reactions: { likes: 0, dislikes: 0 }, // 초기 반응값
          tags: response.tags || [], // 서버 응답 태그 또는 빈 배열
          ...response, // 서버에서 온 추가 필드들
        };

        return {
          ...oldData,
          posts: [newPost, ...oldData.posts],
          total: oldData.total + 1,
        };
      });

      console.log('게시물 추가 성공', response);
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
    onSuccess: (response, updatedPost) => {
      // 모든 게시물 쿼리 캐시에서 해당 게시물 업데이트
      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData?.posts) return oldData;

        // 수정된 게시물을 목록에서 찾아서 업데이트
        const updatedPosts = oldData.posts.map((post: any) => {
          if (post.id === updatedPost.id) {
            return {
              ...post,
              title: updatedPost.title,
              body: updatedPost.body,
              ...response, // 서버에서 온 추가 필드들
            };
          }
          return post;
        });

        return {
          ...oldData,
          posts: updatedPosts,
        };
      });

      console.log('게시물 수정 성공', response);
    },
    onError: (error) => {
      console.error('게시물 업데이트 오류:', error);
    },
  });
};

// 게시물 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (response, deletedId) => {
      // 모든 게시물 쿼리 캐시에서 해당 게시물 제거
      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData?.posts) return oldData;

        // 삭제된 게시물을 목록에서 제거
        const filteredPosts = oldData.posts.filter((post: any) => post.id !== deletedId);

        return {
          ...oldData,
          posts: filteredPosts,
          total: oldData.total - 1,
        };
      });

      console.log('게시물 삭제 성공', response);
    },
    onError: (error) => {
      console.error('게시물 삭제 오류:', error);
    },
  });
};
