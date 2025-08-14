import { Plus, Search } from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shared/ui"
import { useQueryStates, parseAsString } from "nuqs"
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query"
import { postQueries } from "../entities/post/api/queries"
import { userQueries } from "../entities/user/api/queries"
import { postMutations } from "../entities/post/api/mutations"
import { Post, Tag } from "../entities/post/model"
import { User } from "../entities/user/model"
import { useUserProfileDialog } from "../features/user/view-profile/lib/useUserProfileDialog"
import { PostsTable } from "../widgets/posts-table/ui"
import { useAddPost } from "../features/post/add-post"
import { useEditPost } from "../features/post/edit-post"
import { usePostDetailDialog } from "../widgets/post-detail"

const PostsManager = () => {
  const [queryParams, setQueryParams] = useQueryStates({
    skip: parseAsString.withDefault("0"),
    limit: parseAsString.withDefault("10"),
    search: parseAsString.withDefault(""),
    sortBy: parseAsString.withDefault(""),
    order: parseAsString.withDefault("asc"),
    tag: parseAsString.withDefault(""),
  })

  const { skip, limit, search: searchQuery, sortBy, order, tag: selectedTag } = queryParams

  const { openProfile, overlay: profileOverlay } = useUserProfileDialog()

  const postQuery = useQuery({
    ...postQueries.listQuery({
      limit: +limit,
      skip: +skip,
      sortBy: sortBy && sortBy !== "none" ? sortBy : "id",
      order: order === "desc" ? "desc" : "asc",
    }),
    enabled: !searchQuery && (!selectedTag || selectedTag === "all"),
    placeholderData: keepPreviousData,
  })

  const { data: users } = useQuery(userQueries.listQuery())

  const { data: tags } = useQuery(postQueries.tagQuery())

  // TODO: 이걸 나중에 묶는걸 고려해봐도...
  const searchedPostsQuery = useQuery({
    ...postQueries.searchQuery({
      search: searchQuery,
      limit: +limit,
      skip: +skip,
      sortBy: sortBy && sortBy !== "none" ? sortBy : "id",
      order: order === "desc" ? "desc" : "asc",
    }),
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
  })

  const tagPostsQuery = useQuery({
    ...postQueries.listByTagQuery({
      tag: selectedTag,
      limit: +limit,
      skip: +skip,
      sortBy: sortBy && sortBy !== "none" ? sortBy : "id",
      order: order === "desc" ? "desc" : "asc",
    }),
    enabled: !!selectedTag && selectedTag !== "all",
    placeholderData: keepPreviousData,
  })
  const active = searchQuery ? searchedPostsQuery : selectedTag && selectedTag !== "all" ? tagPostsQuery : postQuery

  const isLoading = active.isLoading

  const posts =
    active.data?.posts?.map((post: Post) => ({
      ...post,
      author: users?.users?.find((user: User) => user.id === post.userId),
    })) ?? []
  const total = active.data?.total ?? 0

  const deletePostMutation = useMutation(postMutations.deleteMutation())
  const deletePost = (id: number) => {
    deletePostMutation.mutate(id)
  }

  const { openDetail, overlay: detailOverlay } = usePostDetailDialog()

  const openPostDetail = (post: Post) => {
    openDetail(post, searchQuery)
  }

  const openUserModal = (user: User) => {
    openProfile(user.id)
  }

  const { addPost, overlay: addPostOverlay } = useAddPost()
  const { editPost, overlay: editPostOverlay } = useEditPost()

  const renderPostTable = () => (
    <PostsTable
      posts={posts}
      selectedTag={selectedTag}
      searchQuery={searchQuery}
      onTagClick={(tag) => setQueryParams({ tag })}
      onOpenUser={(user) => user && openUserModal(user)}
      onOpenDetail={openPostDetail}
      onEdit={(post) => {
        editPost(post)
      }}
      onDelete={deletePost}
    />
  )

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => addPost()}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setQueryParams({ search: e.target.value })}
                  onKeyPress={(e) => e.key === "Enter"}
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setQueryParams({ tag: value })
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags?.map((tag: Tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setQueryParams({ sortBy: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            <Select value={order} onValueChange={(value) => setQueryParams({ order: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          {isLoading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select value={limit} onValueChange={(value) => setQueryParams({ limit: value })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button
                disabled={parseInt(skip) === 0}
                onClick={() => setQueryParams({ skip: Math.max(0, parseInt(skip) - parseInt(limit)).toString() })}
              >
                이전
              </Button>
              <Button
                disabled={parseInt(skip) + parseInt(limit) >= total}
                onClick={() => setQueryParams({ skip: (parseInt(skip) + parseInt(limit)).toString() })}
              >
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {profileOverlay}
      {addPostOverlay}
      {editPostOverlay}
      {detailOverlay}
    </Card>
  )
}

export default PostsManager
