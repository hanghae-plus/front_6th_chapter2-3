import { Comment } from "@/entities/Comment"
import { atom, useAtom } from "jotai"

const selectedCommentAtom = atom<Comment | null>(null)

export const useComment = () => {
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)

  return new (class {
    selectedComment = selectedComment
    setSelectedComment = setSelectedComment
  })()
}
