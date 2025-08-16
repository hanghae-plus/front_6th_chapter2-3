import { useShallow } from "zustand/shallow"

import { usePostsWithAuthors } from "@/features/get-post/api"
import { usePostParamsStore } from "@/features/get-post/model"
import { PostSearchInput, PostSortBySelect, PostSortOrderSelect, PostTagFilterSelect } from "@/features/get-post/ui"
import { PostPagination } from "@/modules/post-pagination/ui"
import { PostTable } from "@/modules/post-table/ui"

export function PostsContent() {
  const { limit, search, skip, tag } = usePostParamsStore(useShallow((state) => state))
  const { posts, total, loading } = usePostsWithAuthors({ limit, skip, search, tag })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <PostSearchInput />
        <PostTagFilterSelect />
        <PostSortBySelect />
        <PostSortOrderSelect />
      </div>
      {loading ? <div className="flex justify-center p-4">로딩 중...</div> : <PostTable posts={posts} />}
      <PostPagination total={total} />
    </div>
  )
}
