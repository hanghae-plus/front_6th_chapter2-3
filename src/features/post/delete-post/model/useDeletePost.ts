import { deletePostApi } from '../../../../entities/post/api/post-api';

export const useDeletePost = (onSuccess?: (deletedId: number) => void) => {
  const deletePost = async (id: number) => {
    try {
      await deletePostApi(id);

      // 게시물 삭제 성공 후 처리
      // setPosts(posts.filter((post) => post.id !== id));
      onSuccess?.(id);
    } catch (error) {
      console.error('게시물 삭제 오류:', error);
    }
  };

  return { deletePost };
};
