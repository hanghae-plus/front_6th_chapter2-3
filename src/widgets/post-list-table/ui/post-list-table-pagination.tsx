import { postEntityQueries } from "@/entities/posts"
import { useQueryParamsPagination } from "@/shared/hooks"
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"
import { useQuery } from "@tanstack/react-query"
import { POST_PAGINATION_LIMIT_OPTIONS } from "../model"

export const PostListTablePagination = () => {
  const [queryParamsPagination, setQueryParamsPagination] = useQueryParamsPagination()
  const postsQuery = useQuery({
    ...postEntityQueries.getPosts({ limit: queryParamsPagination.limit, skip: queryParamsPagination.skip }),
  })

  const handleLimitChange = (limit: number) => {
    setQueryParamsPagination((prevPagination) => ({ ...prevPagination, limit }))
  }

  const handleNextPage = () => {
    setQueryParamsPagination((prevPagination) => ({
      ...prevPagination,
      skip: prevPagination.skip + prevPagination.limit,
    }))
  }
  const handlePreviousPage = () => {
    setQueryParamsPagination((prevPagination) => ({
      ...prevPagination,
      skip: Math.max(0, prevPagination.skip - prevPagination.limit),
    }))
  }
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select
          value={queryParamsPagination.limit.toString()}
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
        <Button disabled={queryParamsPagination.skip === 0} onClick={handlePreviousPage}>
          이전
        </Button>
        <Button
          disabled={queryParamsPagination.skip + queryParamsPagination.limit >= (postsQuery.data?.total ?? 0)}
          onClick={handleNextPage}
        >
          다음
        </Button>
      </div>
    </div>
  )
}
