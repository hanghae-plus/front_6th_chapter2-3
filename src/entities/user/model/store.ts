import { atom } from "jotai"
import { SelectedUser } from "./types"

// 사용자 정보 모달 상태 atom
export const showUserModalAtom = atom(false)

// 선택된 사용자 정보 atom
export const selectedUserAtom = atom<SelectedUser>(null)
