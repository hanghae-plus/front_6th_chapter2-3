const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const USER = {
  LIST: `${BASE_URL}/users?limit=0&select=username,image`,
  DETAIL: (userId: number) => `${BASE_URL}/users/${userId}`,
};
