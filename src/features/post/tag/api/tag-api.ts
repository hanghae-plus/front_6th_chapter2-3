export const getTagApi = async () => {
  const response = await fetch("/api/posts/tags")
  if (!response.ok) {
    throw new Error("태그 추가에 실패했습니다.")
  }
  return response
}

// 특정 태그로 게시물 목록을 가져오는 API 함수
export const getPostsByTagApi = async (tag: string) => {
  const response = await fetch(`/api/posts/tag/${tag}`)
  if (!response.ok) {
    throw new Error("해당 태그의 게시물 목록을 가져오는데 실패했습니다.")
  }
  return response
}
