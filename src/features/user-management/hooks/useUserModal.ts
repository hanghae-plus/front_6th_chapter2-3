import { useState } from "react"

import { userApi } from "@/entities/user/api"
import type { User, UserDetail } from "@/entities/user/model"

export const useUserModal = () => {
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null)

  const openUserModal = async (user: User) => {
    try {
      const userData = await userApi.getUserById(user.id)
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  return {
    showUserModal,
    setShowUserModal,
    selectedUser,
    openUserModal,
  }
}
