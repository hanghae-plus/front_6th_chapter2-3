import type { DeleteResponse, PaginatedResponse } from "@/base/api/types"
import type { Post, PostTag } from "@/entities/post/model/entity"

export namespace FetchPosts {
  export type Payload = {
    limit?: number
    skip?: number
  }

  export type Response = PaginatedResponse<Post, "posts">
}

export namespace FetchPostsSearch {
  export type Payload = {
    query?: string
  }

  export type Response = PaginatedResponse<Post, "posts">
}

export namespace FetchPostsByTag {
  export type Payload = {
    tag: string
  }

  export type Response = PaginatedResponse<Post, "posts">
}

export namespace FetchTags {
  export type Payload = unknown

  export type Response = PostTag[]
}

export namespace AddPost {
  export type Payload = {
    title: string
    body: string
    userId: number
  }

  export type Response = Pick<Post, "id" | "title" | "body" | "userId">
}

export namespace UpdatePost {
  export type Payload = {
    id: number
    title: string
    body: string
    userId: number
  }

  export type Response = Omit<Post, "views">
}

export namespace DeletePost {
  export type Payload = {
    id: number
  }

  export type Response = DeleteResponse<Post>
}
