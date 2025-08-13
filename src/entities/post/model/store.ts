import { IAddPostResponse, IEditPostResponse, IPost, IPosts } from './type';

// 게시글 관련 순수 함수
export const postModel = {
  /**
   * 게시글 추가
   */
  addPost: (postData: IPosts, newPost: IPost): IPosts => {
    return {
      ...postData,
      posts: [newPost, ...postData.posts],
    };
  },

  /**
   * 게시글 업데이트
   */
  updatePost: (postData: IPosts, updatedPost: IPost): IPosts => {
    return {
      ...postData,
      posts: postData.posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
    };
  },

  /**
   * 게시글 삭제
   */
  deletePost: (postData: IPosts, post: IPost): IPosts => {
    return {
      ...postData,
      posts: postData.posts.filter((p) => p.id !== post.id),
    };
  },

  addResponseToPost: (res: IAddPostResponse): IPost => {
    return {
      ...res,
      tags: [],
      views: 0,
      reactions: {
        likes: 0,
        dislikes: 0,
      },
    };
  },

  editResponseToPost: (res: IEditPostResponse): IPost => {
    return {
      ...res,
      views: 0,
    };
  },
};
