import { atom } from "jotai"
import { PostTag } from "./types"

// 태그 목록 atom
export const tagsAtom = atom<PostTag[]>([])

// 선택된 태그 atom
export const selectedTagAtom = atom("")
