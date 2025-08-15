// 사용자 타입
export interface UsersType {
  users: UserType[];
  limit: number;
  skip: number;
  total: number;
}

export interface UserType {
  id: number;
  image: string;
  username: string;
}

export interface UserDetailType {
  address: AddressType;
  age: number;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  birthDate: string;
  bloodGroup: string;
  company: {
    address: AddressType;
    department: string;
    name: string;
    title: string;
  };
  crypto: {
    coin: string;
    network: string;
    wallet: string;
  };
  ein: string;
  email: string;
  eyeColor: string;
  firstName: string;
  gender: string;
  hair: {
    color: string;
    type: string;
  };
  height: number;
  id: number;
  image: string;
  ip: string;
  lastName: string;
  macAddress: string;
  maidenName: string;
  password: string;
  phone: string;
  role: string;
  ssn: string;
  university: string;
  userAgent: string;
  username: string;
  weight: number;
}

export interface AddressType {
  address: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  country: string;
  postalCode: string;
  state: string;
  stateCode: string;
}

// 사용자 목록 조회
export interface GetUsersRequestType {
  limit: number;
  select?: string;
}
export interface GetUsersResponseType {
  users: UserType[];
  limit: number;
  skip: number;
  total: number;
}

// 사용자 상세 조회
export type GetUserResponseType = UserDetailType;
