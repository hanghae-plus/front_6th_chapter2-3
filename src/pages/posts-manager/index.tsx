import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { isAddPostModalOpenAtom } from "../../features/add-post/model/atoms"
import {
  editingPostAtom,
  isEditPostModalOpenAtom,
} from "../../features/edit-post/model/atoms"
import {
  isUserInfoModalOpenAtom,
  viewingUserIdAtom,
} from "../../features/user-management/model/atoms"
import {
  detailPostAtom,
  isPostDetailModalOpenAtom,
} from "../../features/view-post-detail/model/atoms"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../shared/ui"
import {
  addPostApi,
  deletePostApi,
  fetchPostsApi,
  PostDTO,
  searchPostsApi,
  updatePostApi,
} from "../../entities/posts/api"
import { fetchTagsApi } from "../../entities/tags/api"
import { fetchUsersApi } from "../../entities/users/api"
import {
  deleteCommentApi,
  fetchCommentsApi,
  likeCommentApi,
} from "../../entities/comments/api"
import { fetchPostsByTagApi } from "../../entities/posts/api/fetchPostsByTag"
import PostsTable from "../../features/posts-management/ui/posts-table"
import UserInfoModal from "../../widgets/user-modal"
import PostSearchFilter from "../../features/posts-search-filter/ui/PostSearchFilter"
import PostPagination from "../../features/posts-pagination/ui/PostPagination"
import AddPostModal from "../../widgets/add-post-modal"
import EditPostModal from "../../widgets/edit-post-modal"
import AddCommentModal from "../../widgets/add-comment-modal"
import EditCommentModal from "../../widgets/edit-comment-modal"
import PostDetailModal from "../../widgets/post-detail-modal"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 검색 관련
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")

  // 모달 관련 (Jotai)
  const setIsAddPostModalOpen = useSetAtom(isAddPostModalOpenAtom)
  const setEditingPost = useSetAtom(editingPostAtom)
  const setIsEditPostModalOpen = useSetAtom(isEditPostModalOpenAtom)
  const setDetailPost = useSetAtom(detailPostAtom)
  const setIsPostDetailModalOpen = useSetAtom(isPostDetailModalOpenAtom)
  const setViewingUserId = useSetAtom(viewingUserIdAtom)
  const setIsUserInfoModalOpen = useSetAtom(isUserInfoModalOpenAtom)

  const detailPost = useAtomValue(detailPostAtom)

  // 현재 선택된 태그
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")

  const queryClient = useQueryClient()

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  const getPosts = async () => {
    let postsData
    if (searchQuery) {
      postsData = await searchPostsApi({ query: searchQuery })
    } else if (selectedTag && selectedTag !== "all") {
      postsData = await fetchPostsByTagApi(selectedTag)
    } else {
      postsData = await fetchPostsApi({ limit, skip })
    }

    const usersData = await (await fetchUsersApi()).users

    const postsWithUsers = postsData.posts.map((post: PostDTO) => ({
      ...post,
      author: usersData.find((user) => user.id === post.userId),
    }))
    return { posts: postsWithUsers, total: postsData.total }
  }

  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ["posts", { skip, limit, searchQuery, sortBy, sortOrder, selectedTag }],
    queryFn: getPosts,
    placeholderData: (previousData) => previousData,
  })

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTagsApi,
  })

  // 게시물 검색
  const searchPosts = () => {
    updateURL()
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = (tag: string) => {
    setSelectedTag(tag)
    updateURL()
  }

  // 게시물 추가
  const { mutate: addPostMutate } = useMutation({
    mutationFn: addPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      setIsAddPostModalOpen(false)
    },
    onError: (error) => {
      console.error("게시물 추가 오류:", error)
    },
  })

  const addPostFlow = (newPost: { title: string; body: string; userId: number }) => {
    addPostMutate(newPost)
  }

  // 게시물 업데이트
  const { mutate: updatePostMutate } = useMutation({
    mutationFn: updatePostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      setIsEditPostModalOpen(false)
    },
    onError: (error) => {
      console.error("게시물 업데이트 오류:", error)
    },
  })

  const updatePost = (updatedPost: PostDTO) => {
    updatePostMutate({ selectedPost: updatedPost })
  }

  // 게시물 삭제
  const { mutate: deletePostMutate } = useMutation({
    mutationFn: deletePostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: (error) => {
      console.error("게시물 삭제 오류:", error)
    },
  })

  const deletePost = (id: number) => {
    deletePostMutate(id)
  }

  // 댓글 가져오기
  const { data: commentsData } = useQuery({
    queryKey: ["comments", detailPost?.id],
    queryFn: () => fetchCommentsApi(detailPost!.id),
    enabled: !!detailPost,
  })

  // 댓글 삭제
  const { mutate: deleteCommentMutate } = useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
    onError: (error) => {
      console.error("댓글 삭제 오류:", error)
    },
  })

  const deleteComment = (id: number, postId: number) => {
    deleteCommentMutate({ id, postId })
  }

  // 댓글 좋아요
  const { mutate: likeCommentMutate } = useMutation({
    mutationFn: (id: number) => likeCommentApi(id, 1),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
    },
    onError: (error) => {
      console.error("댓글 좋아요 오류:", error)
    },
  })

  const likeComment = (id: number, postId: number) => {
    likeCommentMutate(id)
  }

  // 게시물 상세 보기
  const openPostDetail = (post: PostDTO) => {
    setDetailPost(post)
    setIsPostDetailModalOpen(true)
  }

  // 사용자 모달 열기
  const openUserModal = (userId: number) => {
    setViewingUserId(userId)
    setIsUserInfoModalOpen(true)
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  // 게시물 테이블 렌더링
  const renderPostTable = () => {
    if (postsLoading) return <div className="flex justify-center p-4">로딩 중...</div>
    if (postsError) return <div className="flex justify-center p-4">게시물 로딩 오류: {postsError.message}</div>
    return (
      <PostsTable
        posts={postsData?.posts || []}
        search={{ query: searchQuery, tag: selectedTag }}
        onClickTag={(tag) => {
          setSelectedTag(tag)
        }}
        onClickUser={(author) => {
          openUserModal(author.id)
        }}
        onClickActionButton={(type, post) => {
          switch (type) {
            case "read":
              openPostDetail(post)
              break

            case "edit":
              setEditingPost(post)
              setIsEditPostModalOpen(true)
              break

            case "delete":
              deletePost(post.id)
              break
          }
        }}
      />
    )
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setIsAddPostModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostSearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPosts={searchPosts}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            fetchPostsByTag={fetchPostsByTag}
            updateURL={updateURL}
            tags={tagsData || []}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          {renderPostTable()}

          <PostPagination
            limit={limit}
            setLimit={setLimit}
            skip={skip}
            setSkip={setSkip}
            total={postsData?.total || 0}
          />
        </div>
      </CardContent>

      <AddPostModal onAddPost={addPostFlow} />

      <EditPostModal onUpdatePost={updatePost} />

      <AddCommentModal />

      <EditCommentModal />

      <PostDetailModal
        comments={commentsData?.comments!}
        onClickLike={(id, postId) => likeComment(id, postId)}
        onClickDelete={(id, postId) => deleteComment(id, postId)}
      />

      <UserInfoModal />
    </Card>
  )
}

export default PostsManager
