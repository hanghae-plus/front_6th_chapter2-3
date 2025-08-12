import { User } from '../model/types';

const API_BASE_URL = '/api/users';

export const fetchAllUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}?limit=0&select=username,image`);
  if (!response.ok) throw new Error('Failed to fetch users');
  const data = await response.json();
  return data.users;
};

export const fetchUserById = async (userId: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/${userId}`);
  if (!response.ok) throw new Error(`Failed to fetch user with id ${userId}`);
  return response.json();
};
