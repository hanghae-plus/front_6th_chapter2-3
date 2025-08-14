import type { Comment } from "@/entities/comment/model/entity"
import type { DeleteResponse, PaginatedResponse } from "@/shared/api/types"

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
    postId: number
    body: string
  }

  export type Response = Comment
}

export namespace PatchComment {
  export type Payload = {
    postId: number
    likes: number
  }

  export type Response = Comment
}

export namespace DeleteComment {
  export type Payload = {
    postId: number
  }

  export type Response = DeleteResponse<Comment>
}
