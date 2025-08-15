import { atom } from "jotai"
import { UserInfo } from "../../../entities/users/api/types"

// User 관련 atoms
export const selectedUserAtom = atom<UserInfo | null>(null)
