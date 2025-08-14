import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@shared/ui"
import { usePostsBrowseParams, PostsFilterBar } from "@features/post/browse-posts"
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query"
import { postQueries } from "@entities/post/api/queries"
import { userQueries } from "@entities/user/api/queries"
import { postMutations } from "@entities/post/api/mutations"
import { Post } from "@entities/post/model"
import { User } from "@entities/user/model"
import { useUserProfileDialog } from "@features/user/view-profile/lib/useUserProfileDialog"
import { PostsTable } from "@widgets/posts-table/ui"
import { useAddPost } from "@features/post/add-post"
import { useEditPost } from "@features/post/edit-post"
import { usePostDetailDialog } from "@widgets/post-detail"
import { PostsPagination } from "@widgets/posts-pagination"

const PostsManager = () => {
  const { params, setParams, stepPrev, stepNext } = usePostsBrowseParams()
  const { skip, limit, searchQuery, sortBy, order, tag: selectedTag } = params

  const { openProfile, overlay: profileOverlay } = useUserProfileDialog()

  const postQuery = useQuery({
    ...postQueries.listQuery({
      limit,
      skip,
      sortBy: sortBy && sortBy !== "none" ? sortBy : "id",
      order,
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
      limit,
      skip,
      sortBy: sortBy && sortBy !== "none" ? sortBy : "id",
      order,
    }),
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
  })

  const tagPostsQuery = useQuery({
    ...postQueries.listByTagQuery({
      tag: selectedTag,
      limit,
      skip,
      sortBy: sortBy && sortBy !== "none" ? sortBy : "id",
      order,
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

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={addPost}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostsFilterBar tags={tags} params={params} onChange={setParams} />

          <PostsTable
            posts={posts}
            selectedTag={selectedTag}
            searchQuery={searchQuery}
            onTagClick={(tag) => setParams({ tag })}
            onOpenUser={(user) => user && openUserModal(user)}
            onOpenDetail={openPostDetail}
            onEdit={(post) => {
              editPost(post)
            }}
            onDelete={deletePost}
            isLoading={isLoading}
          />

          <PostsPagination
            limit={limit}
            skip={skip}
            total={total}
            onLimitChange={(newLimit) => setParams({ limit: newLimit })}
            onPrev={stepPrev}
            onNext={stepNext}
          />
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
