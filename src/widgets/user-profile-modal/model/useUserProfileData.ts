import { useUserQuery } from '@features/user/get-single-user'
import { usePostsUI } from '@shared/store/posts-ui'

export const useUserProfileData = () => {
  const { selectedUserId, showUserModal, setShowUserModal, setSelectedUserId } = usePostsUI()

  // ID로 사용자 데이터 조회
  const { data: selectedUser, isLoading } = useUserQuery(selectedUserId!, {
    enabled: !!selectedUserId && showUserModal,
  })

  const handleCloseModal = () => {
    setShowUserModal(false)
    setSelectedUserId(null)
  }

  return {
    selectedUser,
    isLoading,
    showUserModal,
    handleCloseModal,
  }
}