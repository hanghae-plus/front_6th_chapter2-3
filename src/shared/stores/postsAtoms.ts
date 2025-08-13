import { atom } from "jotai"
import { Comment } from "../../types/comment.type"
import { Post, Tag } from "../../types/product.type"

// 게시물 관련 atoms
export const postsAtom = atom<Post[]>([])
export const commentsAtom = atom<Record<number, Comment[]>>({})
export const tagsAtom = atom<Tag[]>([])

// UI 상태 atoms
export const loadingAtom = atom<boolean>(false)
export const totalAtom = atom<number>(0)

// 파생 atoms
export const postsCountAtom = atom((get) => get(postsAtom).length)
export const commentsCountAtom = atom((get) => {
  const comments = get(commentsAtom)
  return Object.values(comments).reduce((total, commentList) => total + commentList.length, 0)
})
