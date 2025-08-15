import { Comment } from "../../../entities/comments/model/types"

export interface PostDetailModalProps {
  post: any
  isOpen: boolean
  onClose: () => void
  searchQuery: string
}

export interface CommentsListProps {
  comments: Comment[]
  searchQuery: string
}

export interface CommentItemProps {
  comment: Comment
  searchQuery: string
}
