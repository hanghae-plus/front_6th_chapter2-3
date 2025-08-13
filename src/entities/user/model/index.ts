import { User, UserBasic } from '../types';

// 사용자 기본 정보를 찾는 함수
export const findUserById = (users: UserBasic[], userId: number): UserBasic | undefined => {
  return users.find((user) => user.id === userId);
};

// 사용자 이름을 포맷팅하는 함수
export const formatUserName = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.username;
};

// 사용자 주소를 포맷팅하는 함수
export const formatUserAddress = (user: User): string => {
  if (user.address) {
    return `${user.address.address}, ${user.address.city}, ${user.address.state}`;
  }
  return '주소 정보 없음';
};

// 사용자 직장 정보를 포맷팅하는 함수
export const formatUserCompany = (user: User): string => {
  if (user.company) {
    return `${user.company.name} - ${user.company.title}`;
  }
  return '직장 정보 없음';
};
