import { apiClient } from "../client";

export interface PostDTO {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

export interface TagDTO {
  slug: string;
  name: string;
  url: string;
}

export interface GetPostsRequestDTO {
  query: {
    limit: number;
    skip: number;
  };
}

export interface CreatePostRequestDTO {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePostRequestDTO {
  title?: string;
  body?: string;
}

export interface PostsResponseDTO {
  posts: PostDTO[];
  total: number;
  skip: number;
  limit: number;
}

export const postsRequests = {
  // 게시물 목록 조회
  getPosts: async (params: GetPostsRequestDTO) => {
    return apiClient.get<PostsResponseDTO>(`/posts?limit=${params.query.limit}&skip=${params.query.skip}`);
  },

  // 게시물 검색
  searchPosts: async (query: string) => {
    return apiClient.get<PostsResponseDTO>(`/posts/search?q=${query}`);
  },

  // 태그 목록 조회
  getTags: async () => {
    return apiClient.get<TagDTO[]>("/posts/tags");
  },

  // 태그별 게시물 조회
  getPostsByTag: async (tag: string) => {
    return apiClient.get<PostsResponseDTO>(`/posts/tag/${tag}`);
  },

  // 게시물 생성
  createPost: async (data: CreatePostRequestDTO) => {
    return apiClient.post<PostDTO>("/posts/add", data);
  },

  // 게시물 수정
  updatePost: async (id: number, data: UpdatePostRequestDTO) => {
    return apiClient.put<PostDTO>(`/posts/${id}`, data);
  },

  // 게시물 삭제
  deletePost: async (id: number) => {
    return apiClient.delete<void>(`/posts/${id}`);
  },
};
