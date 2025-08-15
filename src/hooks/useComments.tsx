import { atom, useAtom } from "jotai"
import type { Comment } from "../entities/Comment/Comment"
import type { PostId } from "../entities/Post/Post"

const commentsAtom = atom<{ [key: PostId]: Comment[] }>({})

export function useComments() {
  const [comments, setComments] = useAtom(commentsAtom)

  return {
    comments,
    setComments,
  }
}
