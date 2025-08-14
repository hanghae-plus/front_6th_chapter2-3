import { atom } from "jotai"

export const editablePostAtom = atom<{
  title: string
  body: string
  id?: number
  userId?: number
} | null>(null)

export const showEditPostDialogAtom = atom(false)
