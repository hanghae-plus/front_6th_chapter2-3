import { useShallow } from "zustand/shallow"

import { DialogType, useDialogStore } from "@/base/lib"
import type { Post } from "@/entities/post/model"
import type { User } from "@/entities/user/model"
import { useDeletePostMutation } from "@/features/delete-post/api"
import { usePostsWithAuthors } from "@/features/get-post/api"
import { usePostDialogStore, usePostParamsStore } from "@/features/get-post/model"
import { PostSearchInput, PostSortBySelect, PostSortOrderSelect, PostTagFilterSelect } from "@/features/get-post/ui"
import { useUserDialogStore } from "@/features/get-user/model"
import { PostPagination } from "@/modules/post-pagination/ui"
import { PostTable } from "@/modules/post-table/ui"

export function PostsContent() {
  const { openDialog } = useDialogStore((state) => state.actions)
  const { updateParam } = usePostParamsStore((state) => state.actions)
  const { setSelectedPost } = usePostDialogStore((state) => state.actions)
  const { setSelectedUserId } = useUserDialogStore((state) => state.actions)

  const { limit, search, skip, tag } = usePostParamsStore(useShallow((state) => state))

  const deletePostMutation = useDeletePostMutation()

  const { posts, total, loading } = usePostsWithAuthors({ limit, skip, search, tag })

  const handleOpenPostDetail = (post: Post) => {
    setSelectedPost(post)
    openDialog(DialogType.POST_DETAIL)
  }

  const handleOpenUserModal = (user: User) => {
    setSelectedUserId(user.id)
    openDialog(DialogType.USER_MODAL)
  }

  const handleDeletePost = async (id: number) => {
    await deletePostMutation.mutateAsync({ id })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <PostSearchInput />
        <PostTagFilterSelect />
        <PostSortBySelect />
        <PostSortOrderSelect />
      </div>

      {loading ? (
        <div className="flex justify-center p-4">로딩 중...</div>
      ) : (
        <PostTable
          posts={posts}
          onTagClick={(tagValue: string) => updateParam("tag", tagValue)}
          onUserClick={handleOpenUserModal}
          onPostDetailClick={handleOpenPostDetail}
          onPostEditClick={handleOpenPostDetail}
          onPostDeleteClick={handleDeletePost}
        />
      )}

      <PostPagination total={total} />
    </div>
  )
}
