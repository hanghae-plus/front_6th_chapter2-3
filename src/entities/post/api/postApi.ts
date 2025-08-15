import { PostType, GetPostsResponseType, TagType } from "../model/types";
import { createApi } from "@/shared/api/baseApi";

const api = createApi();

export const postApi = {
  // 게시물 목록 가져오기
  async getPosts(limit: number, skip: number): Promise<GetPostsResponseType> {
    return api.get<GetPostsResponseType>(`/posts?limit=${limit}&skip=${skip}`);
  },

  // 게시물 검색
  async searchPosts(
    query: string,
  ): Promise<{ posts: PostType[]; total: number }> {
    return api.get<{ posts: PostType[]; total: number }>(
      `/posts/search?q=${encodeURIComponent(query)}`,
    );
  },

  // 태그별 게시물 가져오기
  async getPostsByTag(
    tag: string,
  ): Promise<{ posts: PostType[]; total: number }> {
    return api.get<{ posts: PostType[]; total: number }>(
      `/posts/tag/${encodeURIComponent(tag)}`,
    );
  },

  // 태그 목록 가져오기
  async getTags(): Promise<TagType[]> {
    return api.get<TagType[]>("/posts/tags");
  },

  // 게시물 추가
  async addPost(post: Partial<PostType>): Promise<PostType> {
    return api.post<PostType>("/posts/add", post);
  },

  // 게시물 수정
  async updatePost(id: number, post: Partial<PostType>): Promise<PostType> {
    return api.put<PostType>(`/posts/${id}`, post);
  },

  // 게시물 삭제
  async deletePost(id: number): Promise<void> {
    return api.delete(`/posts/${id}`);
  },
};
