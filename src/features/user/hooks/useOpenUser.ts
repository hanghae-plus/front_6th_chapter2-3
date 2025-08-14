import { useState } from "react"
import { DetailUser } from "../../../entities/user/model"
import { useModal } from "../../open-modal/useModal"
import { fetchUser } from "../../../entities/user/api"

export const useOpenUser = () => {
  const modal = useModal("userModal")
  const [selectedUser, setSelectedUser] = useState<DetailUser | null>(null)

  /**
   * 사용자 정보 가져오기
   * @param id - 사용자 ID
   */
  const getUserData = async (id: number) => {
    try {
      const data = await fetchUser(id)
      setSelectedUser(data)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  /**
   * 사용자 모달 열기
   * @param id - 사용자 ID
   */
  const openUserModal = async (id: number) => {
    modal.open()
    await getUserData(id)
  }

  return { modal, action: { open: openUserModal }, state: { selectedUser } }
}
