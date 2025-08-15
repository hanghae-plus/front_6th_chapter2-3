import { atom } from "jotai"
import type { UserDetails } from "../../../entities/user/model"

export const selectedUserAtom = atom<UserDetails | null>(null)
export const showUserDialogAtom = atom(false)
