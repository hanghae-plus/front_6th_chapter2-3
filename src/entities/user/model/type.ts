import { IUserSummary } from "../../../shared/lib/api/user";

// 유저 타입
export type ICoordinates = {
  lat: number;
  lng: number;
};

export type IAddress = {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  country: string;
  postalCode: string;
  coordinates: ICoordinates;
};

export type IBank = {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
};

export type ICompanyAddress = {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  country: string;
  postalCode: string;
  coordinates: ICoordinates;
};

export type ICompany = {
  department: string;
  name: string;
  title: string;
  address: ICompanyAddress;
};

export type ICrypto = {
  coin: string;
  wallet: string;
  network: string;
};

export type IHair = {
  color: string;
  type: string;
};

export type IUserDetail = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: 'male' | 'female';
  email: string;
  username: string;
  password: string;
  phone: string;
  birthDate: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  image: string;
  role: 'admin' | 'user';
  ip: string;
  macAddress: string;
  university: string;
  userAgent: string;
  ssn: string;
  ein: string;
  address: IAddress;
  bank: IBank;
  company: ICompany;
  crypto: ICrypto;
  hair: IHair;
};

export type IUsers = {
  limit: number;
  skip: number;
  total: number;
  users: IUserSummary[];
};
