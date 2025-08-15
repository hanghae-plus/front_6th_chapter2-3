import { useAtom } from "jotai"
import { commentsAtom, selectedCommentAtom, newCommentAtom } from "./store"

export const useComments = () => {
  const [comments, setComments] = useAtom(commentsAtom)
  
  return {
    comments,
    setComments,
  }
}

export const useSelectedComment = () => {
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)
  
  return {
    selectedComment,
    setSelectedComment,
  }
}

export const useNewComment = () => {
  const [newComment, setNewComment] = useAtom(newCommentAtom)
  
  return {
    newComment,
    setNewComment,
  }
}