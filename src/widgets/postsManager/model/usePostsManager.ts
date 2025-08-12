import { useState, useCallback } from "react"
import { usePostStore } from "../../../entities/post/model/store"
import { useUserStore } from "../../../entities/user/model/store"
import { postApi } from "../../../entities/post/api/postApi"
import { userApi } from "../../../entities/user/api/userApi"
import { useUrlParams } from "../../../shared/hooks/useUrlParams"
import { usePostManagement } from "../../../features.tsx/postManagement/model/usePostManagement"

export const usePostsManager = () => {
  const { setPosts, setTotal, setLoading, loading, setSelectedPost } = usePostStore()
  const { setSelectedUser, setShowUserModal } = useUserStore()
  const { getParams, updateParams } = useUrlParams()
  const { showAddDialog, setShowAddDialog } = usePostManagement()

  const params = getParams()
  const [skip, setSkip] = useState(parseInt(params.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(params.get("limit") || "10"))
  const [total, setTotalState] = useState(0)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([
        postApi.getPosts({ limit, skip }),
        userApi.getUsers({ limit: 0, select: "username,image" }),
      ])

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
      setTotalState(postsData.total)

      updateParams({ skip, limit })
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }, [limit, skip, setPosts, setTotal, setLoading, updateParams])

  const handlePreviousPage = () => {
    const newSkip = Math.max(0, skip - limit)
    setSkip(newSkip)
  }

  const handleNextPage = () => {
    const newSkip = skip + limit
    setSkip(newSkip)
  }

  const openPostDetail = (post: any) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  const openUserModal = async (user: any) => {
    try {
      const userData = await userApi.getUserById(user.id)
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  return {
    loading,
    skip,
    limit,
    total,
    showPostDetailDialog,
    setLimit,
    setShowPostDetailDialog,
    fetchPosts,
    handlePreviousPage,
    handleNextPage,
    openPostDetail,
    openUserModal,
    showAddDialog,
    setShowAddDialog,
  }
}
