import { useQuery } from "@tanstack/react-query"
import UserAPI from "./api/UserAPI"

export const useUserList = (limit: number, select: string) => {
  return useQuery({
    queryKey: ["users", limit, select],
    queryFn: () => UserAPI.getUserList(limit, select),
  })
}

export const useUserInfo = (id: number) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => UserAPI.getUserInfo(id),
  })
}
