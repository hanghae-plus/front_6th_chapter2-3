import { atom } from "jotai"
import type { Post, PostsTags } from "../../../entities/posts/api/types"

// Posts 관련 atoms
export const postsAtom = atom<Array<Post>>([])
export const tagsAtom = atom<Array<PostsTags>>([])
export const selectedPostAtom = atom<Post | null>(null)
export const newPostAtom = atom({ title: "", body: "", userId: 1 })