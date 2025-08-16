import { updateURLSearchParams, apiClient } from '../../../shared';
import { GetUsersListRequestType, GetUsersListResponseType } from '../model';

export const getUsers = async (
  params: GetUsersListRequestType,
): Promise<GetUsersListResponseType> => {
  const query = updateURLSearchParams(params);
  return apiClient.get(`/users?${query}`);
};

export const getUser = async (id: number) => {
  return apiClient.get(`/users/${id}`);
};

export * from './queries';
