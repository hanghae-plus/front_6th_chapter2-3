import { useAtom } from "jotai"
import { selectedUserAtom, showUserDialogAtom } from "./atoms"
import { fetchUserDetails } from "../../../entities/user/api"
import type { UserSummary } from "../../../entities/user/model"

export const useUserDetail = () => {
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom)
  const [showDialog, setShowDialog] = useAtom(showUserDialogAtom)

  const openUserDetail = async (user: UserSummary) => {
    try {
      const userData = await fetchUserDetails(user.id)
      setSelectedUser(userData)
      setShowDialog(true)
    } catch (error) {
      console.error("Failed to fetch user details:", error)
    }
  }

  const closeDialog = () => {
    setShowDialog(false)
    setSelectedUser(null)
  }

  return {
    selectedUser,
    showDialog,
    openUserDetail,
    closeDialog,
  }
}
