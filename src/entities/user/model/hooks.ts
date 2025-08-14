import { useQuery } from "@tanstack/react-query"
import UserAPI from "../api/UserAPI"
import { User } from "./types"

/**
 * 현재 로그인한 사용자 정보를 가져오는 훅
 * 실제 구현에서는 인증 토큰이나 세션에서 사용자 ID를 가져와야 함
 */
export const useCurrentUser = () => {
  // TODO: 실제 인증 시스템에서는 여기서 현재 사용자 ID를 가져와야 함
  // 현재는 임시로 ID 1을 사용 (실제로는 인증 컨텍스트나 로컬 스토리지에서 가져와야 함)
  const currentUserId = 1

  return useQuery<User>({
    queryKey: ["currentUser", currentUserId],
    queryFn: () => UserAPI.getUserInfo(currentUserId),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}
