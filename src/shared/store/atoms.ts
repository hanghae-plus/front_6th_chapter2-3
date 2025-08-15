import { atom } from "jotai"

// 페이지네이션
export const skipAtom = atom(0)
export const limitAtom = atom(10)
export const totalAtom = atom(0)

// 검색/필터링
export const searchQueryAtom = atom("")
export const selectedTagAtom = atom("")
export const sortByAtom = atom("")
export const sortOrderAtom = atom("asc")

// 로딩 상태 atom
export const loadingAtom = atom(false)

// 다이얼로그 표시 상태 atoms
export const showAddDialogAtom = atom(false)
export const showEditDialogAtom = atom(false)
export const showAddCommentDialogAtom = atom(false)
export const showEditCommentDialogAtom = atom(false)
export const showPostDetailDialogAtom = atom(false)
export const showUserDialogAtom = atom(false)
