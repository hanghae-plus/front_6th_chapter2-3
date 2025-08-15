// 사용자 성별 타입
export type Gender = 'male' | 'female';

// 사용자 머리카락 정보
export interface UserHair {
  color: string;
  type: string;
}

// 사용자 주소 정보
export interface UserAddress {
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
}

// 사용자 은행 정보
export interface UserBank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  iban: string;
}

// 사용자 회사 정보
export interface UserCompany {
  address: UserAddress;
  department: string;
  name: string;
  title: string;
}

// 사용자 암호화폐 정보
export interface UserCrypto {
  coin: string;
  wallet: string;
  network: string;
}

// 개별 사용자 데이터
export interface User {
  // 기본 식별 정보
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  username: string;
  email: string;
  phone: string;

  // 개인 정보
  age: number;
  gender: Gender;
  birthDate: string;
  bloodGroup: string;

  // 신체 정보
  height: number;
  weight: number;
  eyeColor: string;
  hair: UserHair;
  image: string;

  // 주소 정보
  address: UserAddress;

  // 보안/시스템 정보
  password: string;
  role: string;
  ip: string;
  macAddress: string;
  userAgent: string;

  // 금융 정보
  bank: UserBank;
  crypto: UserCrypto;

  // 기타 정보
  university: string;
  company: UserCompany;
  ein: string;
  ssn: string;
}

// 댓글에서 사용되는 간단한 사용자 정보
export interface UserInComment {
  id: number;
  image: string;
  username: string;
}
