import { atom } from "jotai"
import { PostDTO } from "../../../entities/posts/api"

export const isPostDetailModalOpenAtom = atom(false)
export const detailPostAtom = atom<PostDTO | null>(null)
