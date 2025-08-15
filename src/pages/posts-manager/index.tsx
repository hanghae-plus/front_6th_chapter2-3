import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
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
import { fetchUserApi, fetchUsersApi } from "../../entities/users/api"
import {
  addCommentApi,
  Comment,
  deleteCommentApi,
  fetchCommentsApi,
  likeCommentApi,
  updateCommentApi,
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
  const [selectedPost, setSelectedPost] = useState<PostDTO | null>(null)
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")

  // 모달 관련
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  // 현재 선택된 태그,, 및 저장
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")
  const [selectedComment, setSelectedComment] = useState(null)

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

  const { data: tagsData, isLoading: tagsLoading } = useQuery({
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
      setShowAddDialog(false)
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
      setShowEditDialog(false)
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
  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", selectedPost?.id],
    queryFn: () => fetchCommentsApi(selectedPost?.id),
    enabled: !!selectedPost?.id,
  })


  // 댓글 추가
  const { mutate: addCommentMutate } = useMutation({
    mutationFn: addCommentApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
      setShowAddCommentDialog(false)
    },
    onError: (error) => {
      console.error("댓글 추가 오류:", error)
    },
  })

  const addComment = (newComment: { body: string; postId: number | null; userId: number }) => {
    addCommentMutate(newComment)
  }

  // 댓글 업데이트
  const { mutate: updateCommentMutate } = useMutation({
    mutationFn: updateCommentApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
      setShowEditCommentDialog(false)
    },
    onError: (error) => {
      console.error("댓글 업데이트 오류:", error)
    },
  })

  const updateComment = (updatedComment: Comment) => {
    updateCommentMutate({ id: updatedComment.id, body: updatedComment.body })
  }

  // 댓글 삭제
  const { mutate: deleteCommentMutate } = useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
    onError: (error) => {
      console.error("댓글 삭제 오류:", error)
    },
  })

  const deleteComment = (id: number, postId: number) => {
    deleteCommentMutate(id)
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

  const likeComment = (id: number, : numbpostIder) => {
    likeCommentMutate(id)
  }

  // 게시물 상세 보기
  const openPostDetail = (post: PostDTO) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = (userId: number) => {
    setSelectedUserModalId(userId)
    setShowUserModal(true)
  }

  const [selectedUserModalId, setSelectedUserModalId] = useState<number | null>(null)

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user", selectedUserModalId],
    queryFn: () => fetchUserApi(selectedUserModalId!),
    enabled: !!selectedUserModalId,
  })

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
              setSelectedPost(post)
              setShowEditDialog(true)
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
          <Button onClick={() => setShowAddDialog(true)}>
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

          {/* 게시물 테이블 > entities.., post를 그냥 렌더링할 뿐 아닌가??  > entities  */}
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

      <AddPostModal isOpen={showAddDialog} onOpenChange={setShowAddDialog} onAddPost={addPostFlow} />

      <EditPostModal
        post={selectedPost}
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUpdatePost={updatePost}
      />

      <AddCommentModal
        isOpen={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        onAddComment={addComment}
        postId={selectedPost?.id}
      />

      <EditCommentModal
        comment={selectedComment}
        isOpen={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        onUpdateComment={updateComment}
      />

      <PostDetailModal
        isOpen={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        comments={commentsData?.comments!}
        post={selectedPost}
        onAddComment={() => {
          // setNewComment((prev) => ({ ...prev, postId }))
          setShowAddCommentDialog(true)
        }}
        onClickLike={(id, postId) => likeComment(id, postId)}
        onClickEdit={(comment) => {
          setSelectedComment(comment)
          setShowEditCommentDialog(true)
        }}
        onClickDelete={(id, postId) => deleteComment(id, postId)}
      />

      <UserInfoModal isOpen={showUserModal} onOpenChange={setShowUserModal} user={userData} />
    </Card>
  )
}

export default PostsManager
