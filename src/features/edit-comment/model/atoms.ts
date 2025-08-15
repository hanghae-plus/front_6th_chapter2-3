import { atom } from "jotai"
import { Comment } from "../../../entities/comments/api"

export const isEditCommentModalOpenAtom = atom(false)
export const editingCommentAtom = atom<Comment | null>(null)
