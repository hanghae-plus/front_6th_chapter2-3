import { QueryKey } from "@tanstack/react-query"
import { create } from "zustand"

type State = {
  currentQueryKey: QueryKey | null
}

type Action = {
  /**
   * 현재 쿼리키를 저장한다.
   * @param queryKey 쿼리키
   */
  setCurrentQueryKey: (queryKey: QueryKey) => void
}

/**
 * 현재 쿼리키를 저장하는 스토어
 */
export const useCurrentQueryKeyStore = create<State & Action>((set) => ({
  currentQueryKey: null,
  setCurrentQueryKey: (queryKey) => set({ currentQueryKey: queryKey }),
}))
