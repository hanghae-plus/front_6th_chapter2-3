import { atom } from "jotai"

export const newPostDataAtom = atom({ title: "", body: "", userId: 1 })
export const showAddPostDialogAtom = atom(false)
