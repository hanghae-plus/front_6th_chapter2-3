import { Post, PostTag } from "@/entities/post/model"
import type { User } from "@/entities/user/model"
import { usePostDialogStore, usePostParamsStore } from "@/features/get-post/model"
import { PostSearchInput, PostSortBySelect, PostSortOrderSelect, PostTagFilterSelect } from "@/features/get-post/ui"
import { useUserDialogStore } from "@/features/get-user/model"
import { DialogType, useDialogStore } from "@/shared/lib"
import { PostPagination } from "@/widgets/post-pagination/ui"
import { PostTable } from "@/widgets/post-table/ui"

type PostsContentProps = {
  posts: Post[]
  total: number
  loading: boolean
  tags: PostTag[]
  searchPosts: () => Promise<void>
  fetchPostsByTag: (tag: string) => Promise<void>
  deletePost: (id: number) => Promise<void>
}

export function PostsContent({
  posts,
  total,
  loading,
  tags,
  searchPosts,
  fetchPostsByTag,
  deletePost,
}: PostsContentProps) {
  const { openDialog } = useDialogStore((state) => state.actions)
  const { updateParam } = usePostParamsStore((state) => state.actions)
  const { setSelectedPost } = usePostDialogStore((state) => state.actions)
  const { setSelectedUserId } = useUserDialogStore((state) => state.actions)

  const handleOpenPostDetail = (post: Post) => {
    setSelectedPost(post)
    openDialog(DialogType.POST_DETAIL)
  }

  const handleOpenUserModal = (user: User) => {
    setSelectedUserId(user.id)
    openDialog(DialogType.USER_MODAL)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 검색 및 필터 컨트롤 */}
      <div className="flex gap-4">
        <PostSearchInput onSearch={searchPosts} />
        <PostTagFilterSelect tags={tags} onTagChange={fetchPostsByTag} />
        <PostSortBySelect />
        <PostSortOrderSelect />
      </div>

      {/* 게시물 테이블 */}
      {loading ? (
        <div className="flex justify-center p-4">로딩 중...</div>
      ) : (
        <PostTable
          posts={posts}
          onTagClick={(tagValue: string) => updateParam("tag", tagValue)}
          onUserClick={handleOpenUserModal}
          onPostDetailClick={handleOpenPostDetail}
          onPostEditClick={handleOpenPostDetail}
          onPostDeleteClick={deletePost}
        />
      )}

      <PostPagination total={total} />
    </div>
  )
}
