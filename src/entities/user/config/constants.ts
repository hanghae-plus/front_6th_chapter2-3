export const USER = {
  LIST: '/api/users?limit=0&select=username,image',
  DETAIL: (userId: number) => `/api/users/${userId}`,
};
