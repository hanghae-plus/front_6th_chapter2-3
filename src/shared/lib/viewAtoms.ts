import { atom } from "jotai"

export const listSortByAtom = atom<string>("id")
export const listSortOrderAtom = atom<string>("asc")
export const listSkipAtom = atom<number>(0)
export const listLimitAtom = atom<number>(10)
export const listTotalAtom = atom<number>(0)
