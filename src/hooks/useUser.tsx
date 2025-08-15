import { atom, useAtom } from "jotai"
import type { User } from "../entities/User/User"

export const userAtom = atom<User | null>(null)

export function useUser() {
  const [selectedUser, setSelectedUser] = useAtom(userAtom)

  return {
    selectedUser,
    setSelectedUser,
  }
}
