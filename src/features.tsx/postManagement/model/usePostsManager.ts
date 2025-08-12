import { useState, useCallback } from "react"
import { usePostStore } from "../../../entities/post/model/store"
import { useUserStore } from "../../../entities/user/model/store"
import { usePostApi } from "../../../entities/post/api"
import { useUrlParams } from "../../../shared/hooks/useUrlParams"

export const usePostsManager = () => {
  const { setLoading, loading, setSelectedPost } = usePostStore()
  const { setSelectedUser, setShowUserModal } = useUserStore()
  const { fetchPosts: fetchPostsApi } = usePostApi()
  const { getParams, updateParams } = useUrlParams()

  const params = getParams()
  const [skip, setSkip] = useState(parseInt(params.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(params.get("limit") || "10"))
  const [total, setTotal] = useState(0)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)

  const fetchPosts = useCallback(async () => {
    await fetchPostsApi(limit, skip)
    updateParams({ skip, limit })
  }, [limit, skip, fetchPostsApi, updateParams])

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
      // API 호출을 통해 전체 사용자 정보 가져오기
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
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
    showAddDialog,
    showPostDetailDialog,
    setShowAddDialog,
    setShowPostDetailDialog,
    setLimit,
    fetchPosts,
    handlePreviousPage,
    handleNextPage,
    openPostDetail,
    openUserModal,
  }
}
