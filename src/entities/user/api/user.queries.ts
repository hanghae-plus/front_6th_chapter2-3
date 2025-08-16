import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { getUsers, getUserById } from "./user";
import { GetUserParams, GetUsersParams } from "../model";

export const userQueries = {
  // 모든 유저 관련 기본 키
  all: () => ["users"] as const,
  // 유저 목록 키
  lists: () => [...userQueries.all(), "list"] as const,
  // 개별 유저 키
  details: () => [...userQueries.all(), "detail"] as const,

  // 유저 목록
  list: (params: GetUsersParams) =>
    queryOptions({
      queryKey: [...userQueries.lists(), params],
      queryFn: () => getUsers(params),
      placeholderData: keepPreviousData,
    }),

  // 개별 유저
  detail: (params: GetUserParams) =>
    queryOptions({
      queryKey: [...userQueries.details(), params],
      queryFn: () => getUserById(params),
      enabled: !!params.userId,
    }),
};
