import { UserResponse } from '../types.ts';


export const getUsers = async (userId:number):Promise<UserResponse> => {
    const response = await fetch(`/api/users/${userId}`);
    if(!response.ok){
      throw new Error(`사용자 정보를 가져올 수 없습니다: ${response.status}`);
    }

    const userData = await response.json();
    return userData;
}
