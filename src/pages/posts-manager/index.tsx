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
import { fetchTagsApi, Tag } from "../../entities/tags/api"
import { fetchUserApi, fetchUsersApi } from "../../entities/users/api"
import {
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

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 상태 관리
  const [posts, setPosts] = useState<PostDTO[]>([]) //
  const [comments, setComments] = useState<Comment | {}>({}) // commentlist
  const [tags, setTags] = useState<Tag[]>([])

  const [total, setTotal] = useState(0)

  // 검색 관련
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))
  const [selectedPost, setSelectedPost] = useState(null)
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [loading, setLoading] = useState(false)

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
  const [selectedUser, setSelectedUser] = useState(null)

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

  // 게시물 가져오기
  const fetchPosts = async () => {
    setLoading(true)

    try {
      const postsData = await fetchPostsApi({ limit, skip })
      const usersData = await (await fetchUsersApi()).users

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const data = await fetchTagsApi()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const data = await searchPostsApi({ query: searchQuery })
      setPosts(data.posts)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsResponse, usersResponse] = await Promise.all([fetchPostsByTagApi(tag), fetchUsersApi()])
      const postsData = postsResponse
      const usersData = usersResponse

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  // 게시물 추가
  const addPostFlow = async () => {
    try {
      const data = await addPostApi(newPost)
      setPosts([data, ...posts])
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // 게시물 업데이트
  const updatePost = async () => {
    try {
      if (!selectedPost) return

      const data = await updatePostApi({ selectedPost })
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async (id) => {
    try {
      await deletePostApi(id)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 가져오기
  const fetchComments = async (postId) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const data = await fetchCommentsApi(postId)
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 업데이트
  const updateComment = async (newComment: Comment) => {
    try {
      const data = await updateCommentApi({ id: newComment.id, body: newComment.body })
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id, postId) => {
    try {
      deleteCommentApi(id)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeComment = async (id, postId) => {
    try {
      const data = await likeCommentApi(id, 1)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user) => {
    try {
      const userData = await fetchUserApi(user.id)
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

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
    return (
      <PostsTable
        posts={posts}
        search={{ query: searchQuery, tag: selectedTag }}
        onClickTag={(tag) => {
          setSelectedTag(tag)
        }}
        onClickUser={(author) => {
          openUserModal(author)
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
            tags={tags}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          {/* 게시물 테이블 > entities.., post를 그냥 렌더링할 뿐 아닌가??  > entities  */}
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

          <PostPagination limit={limit} setLimit={setLimit} skip={skip} setSkip={setSkip} total={total} />
        </div>
      </CardContent>

      <AddPostModal isOpen={showAddDialog} onOpenChange={setShowAddDialog} onAddPost={addPostFlow} />

      <EditPostModal
        post={selectedPost}
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUpdatePost={updatePost}
      />

      <AddCommentModal isOpen={showAddCommentDialog} onOpenChange={setShowAddCommentDialog} />

      <EditCommentModal
        comment={selectedComment}
        isOpen={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        onUpdateComment={updateComment}
      />

      <PostDetailModal
        isOpen={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        comments={comments[selectedPost?.id]}
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

      <UserInfoModal isOpen={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} />
    </Card>
  )
}

export default PostsManager
