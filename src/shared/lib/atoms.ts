import { atom } from "jotai"
import type { Post, Comment, UserDetails } from "./index"

// Modal state atoms
export const showAddPostDialogAtom = atom(false)
export const showEditPostDialogAtom = atom(false)
export const showUserModalAtom = atom(false)
export const showAddCommentDialogAtom = atom(false)
export const showEditCommentDialogAtom = atom(false)

// Selected entity atoms
export const selectedPostAtom = atom<Post | null>(null)
export const selectedCommentAtom = atom<Comment | null>(null)
export const selectedUserAtom = atom<UserDetails | null>(null)

// Editable entity atoms
export const editablePostAtom = atom<{
  title: string
  body: string
  id?: number
  userId?: number
} | null>(null)

export const editableCommentAtom = atom<Partial<Comment> | null>(null)

// New entity data atoms
export const newPostDataAtom = atom({ title: "", body: "", userId: 1 })
export const newCommentDataAtom = atom({ body: "", postId: 0, userId: 1 })
