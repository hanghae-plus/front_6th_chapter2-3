import { atom, useAtom } from "jotai"

const commentsAtom = atom<{ [key: string]: Comment[] }>({})

export function useComments() {
  const [comments, setComments] = useAtom(commentsAtom)

  return {
    comments,
    setComments,
  }
}
