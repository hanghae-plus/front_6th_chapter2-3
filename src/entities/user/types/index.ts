export interface User {
  id: number;
  username: string;
  image: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  email?: string;
  phone?: string;
  address?: {
    address: string;
    city: string;
    state: string;
  };
  company?: {
    name: string;
    title: string;
  };
}

export interface UserBasic {
  id: number;
  username: string;
  image: string;
}

export interface UsersResponse {
  users: UserBasic[];
}
