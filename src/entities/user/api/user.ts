import { GetUserParams, GetUsersParams } from "../model";
import { usersRequests } from "../../../shared/api/endpoints/users";
import {
  mapUserResponseDTOToEntitiy,
  mapUsersResponseDTOToEntity,
  mapGetUserParamsToDTO,
  mapGetUsersParamsToDTO,
} from "./mappers";

// 사용자 목록 조회
export const getUsers = async (params: GetUsersParams) => {
  const response = await usersRequests.getUsers(mapGetUsersParamsToDTO(params));
  const users = mapUsersResponseDTOToEntity(response);

  return users;
};

// 사용자 상세 정보 조회
export const getUserById = async (params: GetUserParams) => {
  const response = await usersRequests.getUserById(mapGetUserParamsToDTO(params));
  const user = mapUserResponseDTOToEntitiy(response);

  return user;
};
