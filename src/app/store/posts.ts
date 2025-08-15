import { atom } from 'jotai'

// 게시물 관련 상태
export const postsAtom = atom<any[]>([])
export const totalAtom = atom<number>(0) // totalAtom 추가
export const loadingAtom = atom<boolean>(false)

// 검색 및 필터링 상태
export const searchQueryAtom = atom<string>('')
export const selectedTagAtom = atom<string>('')
export const sortByAtom = atom<string>('')
export const sortOrderAtom = atom<'asc' | 'desc'>('asc')

// 페이지네이션 상태
export const skipAtom = atom<number>(0)
export const limitAtom = atom<number>(10)

// 태그 상태
export const tagsAtom = atom<string[]>([])

// 모달 상태
export const showAddDialogAtom = atom<boolean>(false)
export const showEditDialogAtom = atom<boolean>(false)
export const showPostDetailDialogAtom = atom<boolean>(false)
export const showUserModalAtom = atom<boolean>(false)
export const showAddCommentDialogAtom = atom<boolean>(false)
export const showEditCommentDialogAtom = atom<boolean>(false)

// 선택된 항목 상태
export const selectedPostAtom = atom<any>(null)
export const selectedUserAtom = atom<any>(null)
export const selectedCommentAtom = atom<any>(null)

// 새 항목 상태
export const newPostAtom = atom({ title: '', body: '', userId: 1 })
export const newCommentAtom = atom({ body: '', postId: null, userId: 1 })

// 댓글 상태
export const commentsAtom = atom<Record<number, any[]>>({})

// URL 파라미터 상태
export const urlParamsAtom = atom(
  (get) => {
    const skip = get(skipAtom)
    const limit = get(limitAtom)
    const searchQuery = get(searchQueryAtom)
    const sortBy = get(sortByAtom)
    const sortOrder = get(sortOrderAtom)
    const selectedTag = get(selectedTagAtom)

    const params = new URLSearchParams()
    if (skip > 0) params.set("skip", skip.toString())
    if (limit !== 10) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder !== "asc") params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)

    return params.toString()
  },
  (_, set, url: string) => {
    const params = new URLSearchParams(url)
    set(skipAtom, parseInt(params.get("skip") || "0"))
    set(limitAtom, parseInt(params.get("limit") || "10"))
    set(searchQueryAtom, params.get("search") || "")
    set(sortByAtom, params.get("sortBy") || "")
    set(sortOrderAtom, (params.get("sortOrder") as "asc" | "desc") || "asc")
    set(selectedTagAtom, params.get("tag") || "")
  }
)
