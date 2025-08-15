import { atom } from "jotai"
import { PostDTO } from "../../../entities/posts/api"

export const isEditPostModalOpenAtom = atom(false)
export const editingPostAtom = atom<PostDTO | null>(null)
