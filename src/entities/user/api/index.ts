export const fetchUser = async (userId: number) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
};

export const fetchUsers = async () => {
  const response = await fetch('/api/users?limit=0&select=username,image');
  return response.json();
};
