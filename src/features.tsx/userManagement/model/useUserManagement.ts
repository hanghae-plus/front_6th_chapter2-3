import { useUserStore } from "../../../entities/user/model/store"

export const useUserManagement = () => {
  const { setSelectedUser, setShowUserModal } = useUserStore()

  const openUserModal = async (user: any) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  return {
    openUserModal,
  }
}
