import { Post } from "@/entities/post/model"

export type SortBy = "reactions" | "id" | "title"
export type SortOrder = "asc" | "desc"

export const sortPosts = (posts: Post[], sortBy: SortBy, sortOrder: SortOrder): Post[] => {
  const sortedPosts = [...posts]

  switch (sortBy) {
    case "reactions":
      return sortByReactions(sortedPosts, sortOrder)
    case "id":
      return sortById(sortedPosts, sortOrder)
    case "title":
      return sortByTitle(sortedPosts, sortOrder)
    default:
      return sortedPosts
  }
}

const sortByReactions = (posts: Post[], sortOrder: SortOrder): Post[] => {
  return posts.sort((a, b) => {
    const aLikes = a.reactions?.likes || 0
    const bLikes = b.reactions?.likes || 0

    if (sortOrder === "desc") {
      return bLikes - aLikes // 내림차순 (좋아요 많은 순)
    } else {
      return aLikes - bLikes // 오름차순 (좋아요 적은 순)
    }
  })
}

const sortById = (posts: Post[], sortOrder: SortOrder): Post[] => {
  return posts.sort((a, b) => {
    if (sortOrder === "desc") {
      return b.id - a.id // 내림차순 (ID 큰 순)
    } else {
      return a.id - b.id // 오름차순 (ID 작은 순)
    }
  })
}

const sortByTitle = (posts: Post[], sortOrder: SortOrder): Post[] => {
  return posts.sort((a, b) => {
    const titleA = a.title.toLowerCase()
    const titleB = b.title.toLowerCase()

    if (sortOrder === "desc") {
      return titleB.localeCompare(titleA) // 내림차순 (제목 Z→A)
    } else {
      return titleA.localeCompare(titleB) // 오름차순 (제목 A→Z)
    }
  })
}
