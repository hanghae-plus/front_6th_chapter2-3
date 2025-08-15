import { atom } from "jotai"
import { Post, Comment } from "../../../types"

// 포스트 상세 보기 관련 상태 atoms
export const selectedPostAtom = atom<Post | null>(null)
export const showPostDetailDialogAtom = atom<boolean>(false)

// 댓글 관련 상태 atoms (TanStack Query로 대체되므로 제거 예정)
export const commentsAtom = atom<Record<number, Comment[]>>({})
export const searchQueryAtom = atom<string>("")

// 댓글 관련 함수들을 생성하는 atoms (TanStack Query로 대체)
export const addCommentAtom = atom(null, (_get, _set, _postId: number) => {
  // 댓글 추가 로직은 useComments 훅에서 처리
  // 여기서는 단순히 상태만 업데이트
})

export const editCommentAtom = atom(null, (_get, _set, _comment: Comment) => {
  // 댓글 수정 로직은 useComments 훅에서 처리
})

export const deleteCommentAtom = atom(null, (_get, _set, _params: { id: number; postId: number }) => {
  // 댓글 삭제 로직은 useComments 훅에서 처리
})

export const likeCommentAtom = atom(null, (_get, _set, _params: { id: number; postId: number }) => {
  // 댓글 좋아요 로직은 useComments 훅에서 처리
})

// 포스트 상세 보기 열기 함수를 생성하는 atom (fetchComments 제거)
export const openPostDetailAtom = atom(null, (_get, set, { post }: { post: Post }) => {
  set(selectedPostAtom, post)
  set(showPostDetailDialogAtom, true)
})
