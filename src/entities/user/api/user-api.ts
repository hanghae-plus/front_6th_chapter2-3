// 게시물 목록을 가져오는 API 함수
export const getUserApi = async () => {
  const response = await fetch("/api/users?limit=0&select=username,image")
  if (!response.ok) {
    throw new Error("사용자 정보 가져오는데 실패.")
  }
  return response
}
