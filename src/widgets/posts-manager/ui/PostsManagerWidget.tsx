import { useEffect, useCallback } from "react"
import { useAtom } from "jotai"
import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui"
import { SearchAndFilter } from "../../../features/posts-management/ui/SearchAndFilter"
import { PostsTable } from "../../../features/posts-management/ui/PostsTable"
import { AddPostModal } from "../../../features/posts-management/ui/AddPostModal"
import { EditPostModal } from "../../../features/posts-management/ui/EditPostModal"
import { PostDetailModal } from "../../../features/post-detail/ui/PostDetailModal"
import { UserProfileModal } from "../../../features/user-profile/ui/UserProfileModal"
import { AddCommentModal } from "../../../features/post-detail/ui/AddCommentModal"
import { EditCommentModal } from "../../../features/post-detail/ui/EditCommentModal"
import {
  postsAtom,
  tagsAtom,
  loadingAtom,
  totalAtom,
  searchQueryAtom,
  selectedTagAtom,
  sortByAtom,
  sortOrderAtom,
  skipAtom,
  limitAtom,
  selectedPostAtom,
  showAddDialogAtom,
  showEditDialogAtom,
  showPostDetailDialogAtom,
  selectedUserAtom,
  showUserModalAtom,
  commentsAtom,
} from "../../../app/store"

export const PostsManagerWidget = () => {
  const [posts, setPosts] = useAtom(postsAtom)
  const [tags, setTags] = useAtom(tagsAtom)
  const [loading, setLoading] = useAtom(loadingAtom)
  const [, setTotal] = useAtom(totalAtom)
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)
  const [sortBy, setSortBy] = useAtom(sortByAtom)
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom)
  const [skip, setSkip] = useAtom(skipAtom)
  const [limit, setLimit] = useAtom(limitAtom)
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom)
  const [, setShowAddDialog] = useAtom(showAddDialogAtom)
  const [, setShowEditDialog] = useAtom(showEditDialogAtom)
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom)
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom)
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom)
  const [comments, setComments] = useAtom(commentsAtom)

  // 게시물 가져오기
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts?limit=${limit}&skip=${skip}`),
        fetch(`/api/users?limit=0&select=username,image`),
      ])
      const postsData = await postsResponse.json()
      const usersData = await usersResponse.json()

      const postsWithUsers = postsData.posts.map((post: any) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }, [limit, skip, setPosts, setTotal, setLoading])

  // 태그 가져오기
  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch("/api/posts/tags")
      const data = await response.json()
      // 문자열 배열로 정규화(slug 우선)
      const normalized: string[] = Array.isArray(data)
        ? data.map((item: any) => (typeof item === "string" ? item : item?.slug ?? String(item)))
        : []
      setTags(normalized)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }, [setTags])

  // URL 업데이트
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (skip > 0) params.set("skip", skip.toString())
    if (limit !== 10) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder !== "asc") params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)

    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, "", newURL)
  }, [skip, limit, searchQuery, sortBy, sortOrder, selectedTag])

  // 게시물 검색
  const searchPosts = useCallback(async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [searchResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/search?q=${searchQuery}`),
        fetch(`/api/users?limit=0&select=username,image`),
      ])
      const searchData = await searchResponse.json()
      const usersData = await usersResponse.json()

      const postsWithUsers = searchData.posts.map((post: any) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(searchData.total)
      // 검색 결과로 목록을 새로 불러온 시점에 URL 동기화
      updateURL()
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }, [searchQuery, fetchPosts, setPosts, setTotal, setLoading])

  // 태그별 게시물 가져오기
  const fetchPostsByTag = useCallback(async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(`/api/posts/tag/${tag}`),
        fetch(`/api/users?limit=0&select=username,image`),
      ])
      const postsData = await postsResponse.json()
      const usersData = await usersResponse.json()

      const postsWithUsers = postsData.posts.map((post: any) => ({
        ...post,
        author: usersData.users.find((user: any) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }, [fetchPosts, setPosts, setTotal, setLoading])

  // 게시물 삭제
  const deletePost = useCallback(async (id: number) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }, [setPosts])

  // 댓글 가져오기
  const fetchComments = useCallback(async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await fetch(`/api/comments/post/${postId}`)
      const data = await response.json()
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }, [comments, setComments])

  // 게시물 상세 보기
  const openPostDetail = useCallback((post: any) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }, [setSelectedPost, fetchComments, setShowPostDetailDialog])

  // 사용자 모달 열기
  const openUserModal = useCallback(async (user: any) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }, [setSelectedUser, setShowUserModal])

  // 태그 클릭 핸들러
  const handleTagClick = useCallback((tag: string) => {
    setSelectedTag(tag)
    fetchPostsByTag(tag)
  }, [setSelectedTag, fetchPostsByTag])

  // 게시물 좋아요
  const likePost = useCallback(async (id: number) => {
    try {
      // 서버에 없는 API가 있을 수 있어 낙관적 업데이트만 수행
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, reactions: { ...p.reactions, likes: (p.reactions?.likes || 0) + 1 } } : p))
      // 필요시 서버 PATCH 추가 (API가 지원하는 경우)
      // await fetch(`/api/posts/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reactions: { likes: newLikes }}) })
    } catch (e) {
      console.error('게시물 좋아요 오류:', e)
    }
  }, [setPosts])

  // 게시물 싫어요
  const dislikePost = useCallback(async (id: number) => {
    try {
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, reactions: { ...p.reactions, dislikes: (p.reactions?.dislikes || 0) + 1 } } : p))
    } catch (e) {
      console.error('게시물 싫어요 오류:', e)
    }
  }, [setPosts])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    // 목록을 새로 불러오는 모든 케이스에서 URL 동기화
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag, fetchPosts, fetchPostsByTag])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder((params.get("sortOrder") as "asc" | "desc") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search, setSkip, setLimit, setSearchQuery, setSortBy, setSortOrder, setSelectedTag])

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>게시물 관리</span>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              게시물 추가
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <SearchAndFilter
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              tags={tags}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSearchChange={setSearchQuery}
              onTagChange={(tag) => {
                setSelectedTag(tag)
                fetchPostsByTag(tag)
                updateURL()
              }}
              onSortByChange={setSortBy}
              onSortOrderChange={setSortOrder}
              onSearch={searchPosts}
            />

            {loading ? (
              <div className="flex justify-center p-4">로딩 중...</div>
            ) : (
              <PostsTable
                posts={posts}
                searchQuery={searchQuery}
                selectedTag={selectedTag}
                onPostDetail={openPostDetail}
                onEditPost={(post) => {
                  setSelectedPost(post)
                  setShowEditDialog(true)
                }}
                onDeletePost={deletePost}
                onUserClick={openUserModal}
                onTagClick={handleTagClick}
                onLikePost={likePost}
                onDislikePost={dislikePost}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <AddPostModal />
      <EditPostModal />
      <PostDetailModal
        post={selectedPost}
        isOpen={showPostDetailDialog}
        onClose={() => setShowPostDetailDialog(false)}
        searchQuery={searchQuery}
      />
      <UserProfileModal
        user={selectedUser}
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
      />
      <AddCommentModal />
      <EditCommentModal />
    </div>
  )
}
