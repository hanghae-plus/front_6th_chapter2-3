import {
  Post,
  PostWithUser,
  Comment,
  User,
  PostsResponse,
  CommentsResponse,
  TagsResponse,
  NewPost,
  NewComment,
} from '../types';

// 게시물 관련 API
export const postAPI = {
  // 게시물 목록 가져오기
  async fetchPosts(limit: number, skip: number): Promise<PostsResponse> {
    const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`);
    if (!response.ok) {
      throw new Error('게시물 가져오기 실패');
    }
    return response.json();
  },

  // 게시물 검색
  async searchPosts(query: string): Promise<PostsResponse> {
    const response = await fetch(`/api/posts/search?q=${query}`);
    if (!response.ok) {
      throw new Error('게시물 검색 실패');
    }
    return response.json();
  },

  // 태그별 게시물 가져오기
  async fetchPostsByTag(tag: string): Promise<PostsResponse> {
    const response = await fetch(`/api/posts/tag/${tag}`);
    if (!response.ok) {
      throw new Error('태그별 게시물 가져오기 실패');
    }
    return response.json();
  },

  // 게시물 추가
  async addPost(newPost: NewPost): Promise<Post> {
    const response = await fetch('/api/posts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });
    if (!response.ok) {
      throw new Error('게시물 추가 실패');
    }
    return response.json();
  },

  // 게시물 수정
  async updatePost(id: number, post: Partial<Post>): Promise<Post> {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    if (!response.ok) {
      throw new Error('게시물 수정 실패');
    }
    return response.json();
  },

  // 게시물 삭제
  async deletePost(id: number): Promise<void> {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('게시물 삭제 실패');
    }
  },
};

// 댓글 관련 API
export const commentAPI = {
  // 게시물의 댓글 가져오기
  async fetchComments(postId: number): Promise<CommentsResponse> {
    const response = await fetch(`/api/comments/post/${postId}`);
    if (!response.ok) {
      throw new Error('댓글 가져오기 실패');
    }
    return response.json();
  },

  // 댓글 추가
  async addComment(newComment: NewComment): Promise<Comment> {
    const response = await fetch('/api/comments/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment),
    });
    if (!response.ok) {
      throw new Error('댓글 추가 실패');
    }
    return response.json();
  },

  // 댓글 수정
  async updateComment(id: number, body: string): Promise<Comment> {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    if (!response.ok) {
      throw new Error('댓글 수정 실패');
    }
    return response.json();
  },

  // 댓글 삭제
  async deleteComment(id: number): Promise<void> {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('댓글 삭제 실패');
    }
  },

  // 댓글 좋아요
  async likeComment(id: number, likes: number): Promise<Comment> {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes }),
    });
    if (!response.ok) {
      throw new Error('댓글 좋아요 실패');
    }
    return response.json();
  },
};

// 사용자 관련 API
export const userAPI = {
  // 사용자 목록 가져오기 (간단한 정보만)
  async fetchUsers(): Promise<{ users: User[] }> {
    const response = await fetch('/api/users?limit=0&select=username,image');
    if (!response.ok) {
      throw new Error('사용자 목록 가져오기 실패');
    }
    return response.json();
  },

  // 특정 사용자 정보 가져오기
  async fetchUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error('사용자 정보 가져오기 실패');
    }
    return response.json();
  },
};

// 태그 관련 API
export const tagAPI = {
  // 태그 목록 가져오기
  async fetchTags(): Promise<TagsResponse> {
    const response = await fetch('/api/posts/tags');
    if (!response.ok) {
      throw new Error('태그 가져오기 실패');
    }
    return response.json();
  },
};
