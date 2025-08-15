import { useAtom } from "jotai"
import { skipAtom, limitAtom, selectedTagAtom } from "../../../store/postsAtoms"
import { usePostsWithUsers, usePostsByTag } from "../api"
import { useAddPost, useUpdatePost, useDeletePost } from "./usePostsMutation"
import { NewPost, Post } from "../../../types"

export const usePosts = () => {
  const [skip] = useAtom(skipAtom)
  const [limit] = useAtom(limitAtom)
  const [selectedTag] = useAtom(selectedTagAtom)

  // TanStack Query 훅들 사용
  const postsWithUsersQuery = usePostsWithUsers(limit, skip, undefined, undefined, {
    enabled: !selectedTag || selectedTag === "all",
  })

  const postsByTagQuery = usePostsByTag(selectedTag!, limit, skip, {
    enabled: !!selectedTag && selectedTag !== "all",
  })

  // 현재 활성화된 쿼리 선택
  const activeQuery = selectedTag && selectedTag !== "all" ? postsByTagQuery : postsWithUsersQuery

  const posts = activeQuery.data?.posts || []
  const total = activeQuery.data?.total || 0
  const loading = activeQuery.isLoading
  const error = activeQuery.error

  // Mutation 훅들
  const addPostMutation = useAddPost()
  const updatePostMutation = useUpdatePost()
  const deletePostMutation = useDeletePost()

  const addPost = async (newPost: NewPost) => {
    try {
      const result = await addPostMutation.mutateAsync(newPost)
      return result
    } catch (error) {
      console.error("게시물 추가 오류:", error)
      throw error
    }
  }

  const updatePost = async (post: Post) => {
    try {
      const result = await updatePostMutation.mutateAsync({ id: post.id, postData: post })
      return result
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
      throw error
    }
  }

  const deletePost = async (id: number) => {
    try {
      await deletePostMutation.mutateAsync(id)
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
      throw error
    }
  }

  return {
    posts,
    total,
    loading,
    error,
    addPost,
    updatePost,
    deletePost,
    // Mutation 상태들
    isAddingPost: addPostMutation.isPending,
    isUpdatingPost: updatePostMutation.isPending,
    isDeletingPost: deletePostMutation.isPending,
    // 쿼리 상태들
    isFetching: activeQuery.isFetching,
    isRefetching: activeQuery.isRefetching,
  }
}
