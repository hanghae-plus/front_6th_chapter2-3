import { useQuery } from "@tanstack/react-query"
import UserAPI from "../../../entities/user/api/UserAPI"
import { User } from "../../../entities/user/model/types"

/**
 * 특정 사용자 정보를 가져오는 훅
 * @param userId - 사용자 ID
 * @returns 사용자 정보 쿼리 결과
 */
export const useUserInfo = (userId: number | null) => {
  return useQuery<User>({
    queryKey: ["userInfo", userId],
    queryFn: () => {
      if (!userId) userId = 1
      return UserAPI.getUserInfo(userId)
    },
  })
}
