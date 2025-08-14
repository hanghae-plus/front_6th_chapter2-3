export interface BaseUser {
  id: number;
  image: string;
  username: string;
}

export interface User extends BaseUser {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  address: {
    address: string;
    city: string;
    state: string;
  };
  company: {
    name: string;
    title: string;
  };
}

export type UserPick<T extends keyof User> = Pick<User, T>;
