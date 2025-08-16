import type { DeleteResponse, PaginatedResponse } from "@/base/api/types"
import type { Comment } from "@/entities/comment/model/entity"

export namespace FetchCommentsByPostId {
  export type Payload = {
    postId: number
  }

  export type Response = PaginatedResponse<Comment, "comments">
}

export namespace AddComment {
  export type Payload = {
    body: string
    postId: number
    userId: number
  }

  export type Response = Omit<Comment, "likes">
}

export namespace UpdateComment {
  export type Payload = {
    commentId: number
    postId: number
    body: string
  }

  export type Response = Comment
}

export namespace PatchComment {
  export type Payload = {
    commentId: number
    likes: number
  }

  export type Response = Comment
}

export namespace DeleteComment {
  export type Payload = {
    commentId: number
    postId: number
  }

  export type Response = DeleteResponse<Comment>
}
