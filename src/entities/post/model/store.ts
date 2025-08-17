import { atom } from "jotai"
import { PostTag } from "./types"

// 게시물 목록 atom
export const postsAtom = atom([])

// 게시물 총 개수 atom
export const totalPostsAtom = atom(0)

// 검색어 atom
export const searchQueryAtom = atom("")

// 페이지네이션 skip atom
export const skipAtom = atom(0)

// 페이지네이션 limit atom
export const limitAtom = atom(10)

// 선택된 게시물 atom
export const selectedPostAtom = atom(null)

// 게시물 수정 다이얼로그 표시 여부 atom
export const showEditDialogAtom = atom(false)

// 게시물 추가 다이얼로그 표시 여부 atom
export const showAddDialogAtom = atom(false)

// 새 게시물 atom
export const newPostAtom = atom({ title: "", body: "", userId: 1 })
