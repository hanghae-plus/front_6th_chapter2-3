import { User } from '../model';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const userApi = {
  async getUser(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return response.json();
  },

  async getUsersList(): Promise<{ users: User[] }> {
    const response = await fetch(`${API_BASE_URL}/users?limit=0&select=username,image`);
    return response.json();
  },
};
