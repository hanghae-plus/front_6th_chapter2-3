import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { PostsAddRequest, postsApi } from '@/entities/posts';
import { Post } from '@/entities/posts';
import { userApi } from '@/entities/users';

interface UsePostsQueryProps {
  limit: number;
  skip: number;
  tag?: string;
  searchQuery?: string;
}
export const useGetPosts = ({
  limit = 10,
  skip = 0,
  tag,
  searchQuery,
}: UsePostsQueryProps) =>
  useQuery({
    queryKey: ['posts', skip, limit, tag, searchQuery],
    queryFn: async () => {
      // 구조상 여라개를 할수 없어서 그냥 분기처리만 함.
      let postData;
      // 검색
      if (searchQuery) {
        postData = await postsApi.searchPosts(searchQuery);
      } else if (tag && tag !== 'all') {
        // 태그
        postData = await postsApi.getPostsByTag(tag);
      } else {
        // 기존 필터
        postData = await postsApi.getPosts({ limit, skip });
      }

      const userData = await userApi.getUserPost();
      const postsWithUsers = postData.posts.map((post) => ({
        ...post,
        author: userData.users.find((user) => user.id === post.userId),
      }));
      return {
        posts: postsWithUsers,
        total: postData.total,
      };
    },
  });

export const usePosts = () => {
  const queryClient = useQueryClient();

  return {
    // Query

    usePostsByTag: (tag: string) => {
      return useQuery({
        queryKey: ['posts', 'tag', tag],
        queryFn: async () => {
          const postsData = await postsApi.getPostsByTag(tag);
          const usersData = await userApi.getUserPost();
          const postsWithUsers = postsData.posts.map((post) => ({
            ...post,
            author: usersData.users.find((user) => user.id === post.userId),
          }));
          return {
            posts: postsWithUsers,
            total: postsData.total,
          };
        },
        enabled: !!tag && tag !== 'all',
      });
    },
    // Mutations
    createPost: useMutation({
      mutationFn: async (newPost: PostsAddRequest) =>
        await postsApi.createPost(newPost),
      onSuccess: (newPost) => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.setQueryData(['posts', newPost.id], newPost);
      },
    }),

    updatePost: useMutation({
      mutationFn: ({ data }: { data: Post }) => postsApi.updatePost(data),
      onSuccess: (updatedPost) => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.setQueryData(['posts', updatedPost.id], updatedPost);
      },
    }),

    deletePost: useMutation({
      mutationFn: (id: number) => postsApi.deletePost(id),
      onSuccess: (_, deletedId) => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.removeQueries({ queryKey: ['posts', deletedId] });
      },
    }),
  };
};
