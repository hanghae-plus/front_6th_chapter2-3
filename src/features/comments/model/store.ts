import { atom } from "jotai"
import type { Comments } from "../../../entities/comments/api/types"
import type { CommentsObj } from "../comment-list/ui/CommentList"

// Comments 관련 atoms
export const commentsAtom = atom<CommentsObj>({})
export const selectedCommentAtom = atom<Comments | null>(null)
export const newCommentAtom = atom({ body: "", postId: null as number | null, userId: 1 })