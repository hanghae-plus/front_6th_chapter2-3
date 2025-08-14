import { atom } from "jotai"

// 댓글 목록을 저장하는 atom
export const commentsAtom = atom({})

// 선택된 댓글을 저장하는 atom
export const selectedCommentAtom = atom(null)

// 새 댓글 정보를 저장하는 atom
export const newCommentAtom = atom({ body: "", postId: null, userId: 1 })

// 댓글 추가 다이얼로그 표시 여부 atom
export const showAddCommentDialogAtom = atom(false)

// 댓글 수정 다이얼로그 표시 여부 atom
export const showEditCommentDialogAtom = atom(false)
