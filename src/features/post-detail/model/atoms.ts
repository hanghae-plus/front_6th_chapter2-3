import { atom } from "jotai"
import type { Post } from "../../../entities/post/model"

export const selectedPostForDetailAtom = atom<Post | null>(null)
export const showPostDetailDialogAtom = atom(false)
