import {
  AddPost,
  AddPostResponse,
  PostsParams,
  PostsResponse,
  UpdatePost,
  UpdatePostResponse,
} from "@/entities/post/model"
import { http } from "@/shared/lib"

export const postsApi = {
  getPosts: (params?: PostsParams) =>
    http.get<PostsResponse>(`/posts`, {
      params,
    }),

  searchPosts: (query: string, params?: PostsParams) =>
    http.get<PostsResponse>(`/posts/search`, {
      params: {
        q: query,
        ...params,
      },
    }),

  getPostsByTag: (tag: string, params?: PostsParams) =>
    http.get<PostsResponse>(`/posts/tag/${tag}`, {
      params,
    }),
  addPost: (postData: AddPost) => http.post<AddPost, AddPostResponse>(`/posts/add`, postData),
  updatePost: (postData: UpdatePost) => http.put<UpdatePost, UpdatePostResponse>(`/posts/${postData.id}`, postData),
  deletePost: (id: number) => http.del(`/posts/${id}`),
}
