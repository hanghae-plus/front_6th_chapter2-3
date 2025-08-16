import {
  GetUserRequestDTO,
  GetUsersRequestDTO,
  UserResponseDTO,
  UsersResponseDTO,
} from "../../../shared/api/endpoints/users";
import { User, Users, GetUserParams, GetUsersParams } from "../model";

export function mapUserResponseDTOToEntitiy(dto: UserResponseDTO): User {
  return dto;
}

export function mapUsersResponseDTOToEntity(dto: UsersResponseDTO): Users {
  return dto;
}

export const mapGetUserParamsToDTO = (params: GetUserParams): GetUserRequestDTO => {
  return {
    path: {
      userId: params.userId,
    },
  };
};

export const mapGetUsersParamsToDTO = (params: GetUsersParams): GetUsersRequestDTO => {
  return {
    query: {
      limit: params.limit,
      select: params.select,
    },
  };
};
