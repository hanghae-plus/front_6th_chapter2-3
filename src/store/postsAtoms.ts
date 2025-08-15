import { atom } from "jotai"
import { Post, Comment, Tag, NewPost, NewComment, User } from "../types"

// 게시물 관련 상태
export const postsAtom = atom<Post[]>([])
export const totalPostsAtom = atom<number>(0)
export const loadingAtom = atom<boolean>(false)

// 검색 및 필터링 상태
export const searchQueryAtom = atom<string>("")
export const selectedTagAtom = atom<string>("") // 빈 문자열은 유효한 초기값
export const sortByAtom = atom<string>("") // 빈 문자열은 유효한 초기값
export const sortOrderAtom = atom<string>("asc") // 기본값을 명시적으로 설정

// 페이지네이션 상태
export const skipAtom = atom<number>(0)
export const limitAtom = atom<number>(10)

// UI 상태
export const showAddDialogAtom = atom<boolean>(false)
export const showAddCommentDialogAtom = atom<boolean>(false)
export const showEditCommentDialogAtom = atom<boolean>(false)
export const showUserModalAtom = atom<boolean>(false)

// 댓글 상태
export const commentsAtom = atom<Record<number, Comment[]>>({})
export const selectedCommentAtom = atom<Comment | null>(null)

// 폼 데이터
export const newPostAtom = atom<NewPost>({ title: "", body: "", userId: 1 })
export const newCommentAtom = atom<NewComment>({ body: "", postId: null, userId: 1 })

// 선택된 사용자
export const selectedUserAtom = atom<User | null>(null)

// 태그 목록
export const tagsAtom = atom<Tag[]>([])
