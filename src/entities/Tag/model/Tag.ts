export interface TagList {
  tags: Tag[]
  total: number
  skip: number
  limit: number
}

export interface Tag {
  slug: string
  name: string
  url: string
}

export type TagSlug = Tag["slug"]
