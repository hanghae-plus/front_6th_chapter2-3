import { atom } from "jotai"
import { ReactNode } from "react"

// 다이얼로그 atom을 동적으로 생성하는 팩토리
const dialogAtoms = new Map<string, ReturnType<typeof atom<ReactNode | null>>>()

export const createDialogAtom = (id: string) => {
  if (!dialogAtoms.has(id)) {
    dialogAtoms.set(id, atom<ReactNode | null>(null))
  }
  return dialogAtoms.get(id)!
}

// 각 모달별 전용 atoms
export const userInfoDialogAtom = createDialogAtom("user-info")
export const postViewDialogAtom = createDialogAtom("post-view")
export const postEditDialogAtom = createDialogAtom("post-edit")

// 등록된 모든 atom들을 가져오는 함수
export const getAllDialogAtoms = () => Array.from(dialogAtoms.values())
