import { usePostStore } from "@/entities/post/model/store";
import { PostType } from "@/entities/post/model/types";
import { UserType } from "@/entities/user/model/types";
import { useDeletePostMutation } from "@/entities/post/api/hooks";

export const usePostTable = () => {
  const {
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSelectedPost,
    setSelectedUser,
  } = usePostStore();

  const deletePostMutation = useDeletePostMutation();

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleUserClick = (user: UserType) => {
    setSelectedUser(user);
  };

  const handlePostDetailClick = (post: PostType) => {
    setSelectedPost(post);
  };

  const handleEditClick = (post: Partial<PostType>) => {
    setSelectedPost(post);
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await deletePostMutation.mutateAsync(id);
    } catch (error) {
      console.error("게시물 삭제 오류:", error);
    }
  };

  return {
    selectedTag,
    searchQuery,
    handleTagClick,
    handleUserClick,
    handlePostDetailClick,
    handleEditClick,
    handleDeleteClick,
  };
};
