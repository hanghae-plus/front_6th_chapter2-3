import { httpClient } from '../../../shared/config/httpClient';

export const fetchUser = async (userId: number) => {
  const response = await httpClient.get(`/api/users/${userId}`);
  return response.json();
};

export const fetchUsers = async () => {
  const response = await httpClient.get('/api/users?limit=0&select=username,image');
  return response.json();
};
