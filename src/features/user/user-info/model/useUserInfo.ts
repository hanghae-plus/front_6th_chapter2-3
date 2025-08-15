import { useUserDialog } from "../../../../shared/store"
import { useSelectedUser } from "../../model"
import type { UserInfo } from "../../../../entities/users/api/types"

export const useUserInfo = () => {
  const { selectedUser, setSelectedUser } = useSelectedUser()
  const { setShowUserDialog } = useUserDialog()

  const openUserModal = (userId: number) => {
    setSelectedUser({ id: userId } as UserInfo)
    setShowUserDialog(true)
  }

  return { openUserModal, selectedUser }
}
