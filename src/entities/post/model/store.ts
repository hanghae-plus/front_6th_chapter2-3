import { IPost } from './type';

// 게시글 관련 순수 함수
export const postModel = {
  /**
   * 게시글 추가
   */
  addPost: (posts: IPost[], newPost: IPost) => {
    return [newPost, ...posts];
  },

  /**
   * 게시글 업데이트
   */
  updatePost: (posts: IPost[], updatedPost: IPost) => {
    return posts.map((post) =>
      post.id === updatedPost.id ? updatedPost : post
    );
  },

  /**
   * 게시글 삭제
   */
  deletePost: (posts: IPost[], postId: number) => {
    return posts.filter((post) => post.id !== postId);
  },
};
