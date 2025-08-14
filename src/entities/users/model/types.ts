import { BasicUser } from '@/shared/model/types.ts';

type Gender = 'male' | 'femail';

interface Hair {
  color: string;
  type: string;
}

// 주소 타입
interface Address {
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

interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  iban: string;
}
interface Company {
  address: Address;
  department: string;
  name: string;
  title: string;
}
interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}
// ============================================
// 메인 사용자 인터페이스
// ============================================

// http://localhost:5173/api/users/${user.id}
export interface UserResponse {
  // ============================================
  // 기본 식별 정보
  // ============================================
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  username: string;
  email: string;
  phone: string;

  // ============================================
  // 개인 정보
  // ============================================
  age: number;
  gender: Gender;
  birthDate: string;
  bloodGroup: string;

  // ============================================
  // 신체 정보
  // ============================================
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  image: string;

  // ============================================
  // 주소 정보
  // ============================================
  address: Address;

  // ============================================
  // 보안/시스템 정보
  // ============================================
  password: string;
  role: string;
  ip: string;
  macAddress: string;
  userAgent: string;

  // ============================================
  // 금융 정보
  // ============================================
  bank: Bank;
  crypto: Crypto;

  // ============================================
  // 기타 정보
  // ============================================
  university: string;
  company: Company;
  ein: string;
  ssn: string;
}
//http://localhost:5173/api/users
export type UserInComment = BasicUser;

//http://localhost:5173/api/users?limit=0&select=username,image
export interface UserInit {
  limit: number;
  skip: number;
  total: number;
  users: UserInComment[];
}
