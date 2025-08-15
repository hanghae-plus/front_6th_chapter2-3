import { Post } from "../../../types"

/**
 * 게시물이 검색어와 일치하는지 확인
 */
export const matchesSearchQuery = (post: Post, searchQuery: string): boolean => {
  if (!searchQuery.trim()) return true

  const query = searchQuery.toLowerCase()
  return post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query)
}

/**
 * 게시물이 선택된 태그와 일치하는지 확인
 */
export const matchesSelectedTag = (post: Post, selectedTag: string | null): boolean => {
  if (!selectedTag || selectedTag === "all") return true
  return Boolean(post.tags && post.tags.includes(selectedTag))
}

/**
 * 게시물 목록을 검색어와 태그에 따라 필터링
 */
export const filterPosts = (posts: Post[], searchQuery: string, selectedTag: string | null): Post[] => {
  return posts.filter((post) => {
    const matchesSearch = matchesSearchQuery(post, searchQuery)
    const matchesTag = matchesSelectedTag(post, selectedTag)
    return matchesSearch && matchesTag
  })
}
