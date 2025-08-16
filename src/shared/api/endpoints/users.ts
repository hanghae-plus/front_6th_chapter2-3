import { apiClient } from "../client";

export interface GetUserRequestDTO {
  path: {
    userId: number;
  };
}

export interface GetUsersRequestDTO {
  query: {
    limit: number;
    select: string;
  };
}

export interface UsersResponseDTO {
  users: {
    id: number;
    username: string;
    image: string;
  }[];
  total: number;
  skip: number;
  limit: number;
}

export interface UserResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  ip: string;
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    country: string;
  };
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      state: string;
      stateCode: string;
      postalCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
  role: string;
}

export const usersRequests = {
  // 사용자 목록 조회
  getUsers: async (params: GetUsersRequestDTO) => {
    return apiClient.get<UsersResponseDTO>(`/users?limit=${params.query.limit}&select=${params.query.select}`);
  },

  // 사용자 상세 정보 조회
  getUserById: async (params: GetUserRequestDTO) => {
    return apiClient.get<UserResponseDTO>(`/users/${params.path.userId}`);
  },
};
