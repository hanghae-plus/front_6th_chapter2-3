import { useState } from "react"

import { useGetPosts } from "@/entities/post/hook/usePost"
import { changePostSearchParams, DEFAULT_POST_SEARCH_PARAMS } from "@/entities/post/lib/postSearchUtils"
import { PostSearchParams } from "@/entities/post/model"
import { PostPagination } from "@/features/pagination-management/ui"
import { useSearchQuery } from "@/shared/hook"
import { Card, CardContent } from "@/shared/ui/card"
import { PostsTable, PostsTableFilters, PostsTableHeader } from "@/widgets/posts-table/ui"

export const PostsManagerPage = () => {
  const { searchCondition, setSearchCondition } = useSearchQuery<PostSearchParams>(DEFAULT_POST_SEARCH_PARAMS)

  const { posts, total, isLoading } = useGetPosts(changePostSearchParams(searchCondition))

  // 검색어 입력 상태
  const [searchInput, setSearchInput] = useState(searchCondition.search || "")

  return (
    <>
      {/* <PostsManager /> */}
      <Card className="w-full max-w-6xl mx-auto">
        <PostsTableHeader searchCondition={searchCondition} />
        <CardContent>
          <PostsTableFilters
            searchCondition={searchCondition}
            searchInput={searchInput}
            setSearchCondition={setSearchCondition}
            setSearchInput={setSearchInput}
          />
          {/* 게시물 테이블 */}
          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              posts={posts}
              searchCondition={searchCondition}
              setSearchCondition={setSearchCondition}
              setSearchInput={setSearchInput}
            />
          )}
          <PostPagination searchCondition={searchCondition} setSearchCondition={setSearchCondition} total={total} />
        </CardContent>
      </Card>
    </>
  )
}
