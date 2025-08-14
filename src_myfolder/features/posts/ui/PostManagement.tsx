import React from "react"
import { Card, CardContent } from "../../../shared/ui"
import { PostManagerHeader } from "./components/PostManagerHeader"
import { PostFilter } from "./components/PostFilter"
import { PostsTable } from "./components/PostsTable"
import { PaginationControls } from "./components/PaginationControls"
import { TableLoading } from "./loading/TableLoading"
import { useFetchPostsByMode } from "../fetch-posts-by-mode/hooks/useFetchPostsByMode"
import { useSearchMode } from "../fetch-posts-by-mode/hooks/useSearchMode"
import { useTagMode } from "../fetch-posts-by-mode/hooks/useTagMode"
import { useUpdatePost, useDetailPost, useDeletePost } from "../hooks"
import { useOpenUser } from "../../user/hooks/useOpenUser"

interface PostManagementProps {
  onAddPost: () => void
}

export const PostManagement: React.FC<PostManagementProps> = ({ onAddPost }) => {
  const posts = useFetchPostsByMode()
  const searchMode = useSearchMode()
  const tagMode = useTagMode()
  const updatePost = useUpdatePost()
  const detailPost = useDetailPost()
  const deletePost = useDeletePost()
  const openUser = useOpenUser()

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostManagerHeader openAddPostModal={onAddPost} />
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostFilter />

          {/* 게시물 테이블 */}
          {posts.loading ? (
            <TableLoading />
          ) : (
            <PostsTable
              data={{
                rows: posts.posts,
                searchQuery: searchMode.param,
                selectedTag: tagMode.param,
              }}
              handlers={{
                onTagClick: (tag) => tagMode.update(tag),
                onOpenDetail: (post) => detailPost.actions.detail(post),
                onEdit: (post) => updatePost.action.edit(post),
                onDelete: (id) => deletePost.action.delete(id),
                onAuthorClick: (author) => author && openUser.action.open(author.id),
              }}
            />
          )}

          {/* 페이지네이션 */}
          <PaginationControls />
        </div>
      </CardContent>
    </Card>
  )
}
