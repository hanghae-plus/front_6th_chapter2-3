import { api } from "../../shared/api/client";
import type { AllUsersResponse, UserResponse } from "./types";

interface GetUserParams {
  id: number;
}
export const getUser = async ({ id }: GetUserParams): Promise<UserResponse> => {
  return api<UserResponse>(`/api/users/${id}`);
};

export const getAllUsers = async (): Promise<AllUsersResponse> => {
  return api<AllUsersResponse>(`/api/users?limit=0&select=username,image`);
};
