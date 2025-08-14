import { updateURLSearchParams } from "../../../shared";
import { GetUsersListRequestType, GetUsersListResponseType } from "../model";

export const getUsers = async (params: GetUsersListRequestType): Promise<GetUsersListResponseType> => {
  const query = updateURLSearchParams(params);
  const response = await fetch(`/api/users?${query}`);
  return response.json();
}

export const getUser = async (id: number) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}