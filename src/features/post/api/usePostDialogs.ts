import { usePostStore } from "@/entities/post/model/store";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/entities/post/api/hooks";

export const usePostDialogs = () => {
  const { selectedPost, selectedUser, newPost, setNewPost, resetNewPost } =
    usePostStore();

  const createPostMutation = useCreatePostMutation();
  const updatePostMutation = useUpdatePostMutation();

  const handleAddPost = async () => {
    try {
      const postData = {
        title: newPost.title || "",
        body: newPost.body || "",
        userId: newPost.userId || 1,
      };
      await createPostMutation.mutateAsync(postData);
      resetNewPost();
    } catch (error) {
      console.error("게시물 추가 오류:", error);
    }
  };

  const handleUpdatePost = async () => {
    if (!selectedPost?.id) return;

    try {
      const postData = {
        id: selectedPost.id,
        title: selectedPost.title || "",
        body: selectedPost.body || "",
        userId: selectedPost.userId || 1,
        views: selectedPost.views || 0,
        reactions: selectedPost.reactions || { likes: 0, dislikes: 0 },
        tags: selectedPost.tags || [],
      };
      await updatePostMutation.mutateAsync(postData);
    } catch (error) {
      console.error("게시물 수정 오류:", error);
    }
  };

  return {
    selectedPost,
    selectedUser,
    newPost,
    setNewPost,
    handleAddPost,
    handleUpdatePost,
  };
};
