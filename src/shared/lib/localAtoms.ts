import { atom } from "jotai"

// 새로 생성되어 서버에 영구 저장되지 않을 수 있는 게시물들의 id를 저장
export const localCreatedPostIdsAtom = atom<Set<number>>(new Set<number>())
