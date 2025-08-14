import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"
import { postEntityQueries } from "@/entities/posts"
import { POST_PAGINATION_LIMIT_OPTIONS, usePostListFilterQueryParams } from "@/widgets/post-list-table"

import { useQuery } from "@tanstack/react-query"

export const PostListTablePagination = () => {
  const postListFilter = usePostListFilterQueryParams()

  const postsQuery = useQuery({
    ...postEntityQueries.getPosts({ ...postListFilter.queryParams }),
  })

  const postsByTagQuery = useQuery({
    ...postEntityQueries.getPostsBySlug({
      ...postListFilter.queryParams,
      slug: postListFilter.queryParams.selectedTag,
    }),
    enabled: !!postListFilter.queryParams.selectedTag,
  })

  const posts = postListFilter.queryParams.selectedTag ? postsByTagQuery.data : postsQuery.data

  const handleLimitChange = (limit: number) => {
    postListFilter.onLimitChange(limit)
  }

  const handleNextPage = () => {
    postListFilter.onSkipChange(postListFilter.queryParams.skip + postListFilter.queryParams.limit)
  }
  const handlePreviousPage = () => {
    postListFilter.onSkipChange(Math.max(0, postListFilter.queryParams.skip - postListFilter.queryParams.limit))
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select
          value={postListFilter.queryParams.limit.toString()}
          onValueChange={(value) => handleLimitChange(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={POST_PAGINATION_LIMIT_OPTIONS[0].toString()} />
          </SelectTrigger>

          <SelectContent>
            {POST_PAGINATION_LIMIT_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={postListFilter.queryParams.skip === 0} onClick={handlePreviousPage}>
          이전
        </Button>
        <Button
          disabled={postListFilter.queryParams.skip + postListFilter.queryParams.limit >= (posts?.total ?? 0)}
          onClick={handleNextPage}
        >
          다음
        </Button>
      </div>
    </div>
  )
}
