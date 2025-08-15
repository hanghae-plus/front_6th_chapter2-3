import { useQuery } from "@tanstack/react-query";
import { userApi } from "./userApi";
import { userQueryKeys } from "./queryKeys";
import { UserType } from "../model/types";

// 사용자 목록 조회
export const useGetUsersQuery = () => {
  return useQuery({
    queryKey: userQueryKeys.list(),
    queryFn: () => userApi.getUsers(),
  });
};

// 사용자 상세 조회
export const useGetUserQuery = (user: UserType) => {
  return useQuery({
    queryKey: userQueryKeys.detail(user.id),
    queryFn: () => userApi.getUser(user),
    enabled: !!user.id,
  });
};
