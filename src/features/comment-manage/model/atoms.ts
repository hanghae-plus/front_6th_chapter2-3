import { atom } from "jotai"
import type { Comment } from "../../../entities/comment/model"

export const selectedPostAtom = atom<number | null>(null)
export const editableCommentAtom = atom<Partial<Comment> | null>(null)
export const newCommentDataAtom = atom({ body: "", postId: 0, userId: 1 })
export const showAddCommentDialogAtom = atom(false)
export const showEditCommentDialogAtom = atom(false)
