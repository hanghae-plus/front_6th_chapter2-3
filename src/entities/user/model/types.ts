export interface UserType {
  image: string;
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  address: {
    address: string;
    city: string;
    state: string;
  },
  company: {
    name: string;
    title: string;
  }
}

export interface GetUsersListRequestType {
  limit: number;
  select: string;
}

export interface GetUsersListResponseType {
  limit: number;
  skip: number;
  total: number;
  users: UserType[];
}