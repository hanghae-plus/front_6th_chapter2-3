import { useAtom } from "jotai"
import { selectedUserAtom } from "./store"

export const useSelectedUser = () => {
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom)

  return {
    selectedUser,
    setSelectedUser,
  }
}
