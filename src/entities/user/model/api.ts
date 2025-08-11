// 유저 조회
export async function fetchUserBasic() {
  const response = await fetch('/api/users?limit=0&select=username,image');
  if (!response.ok) throw new Error('유저 조회 실패');
  return response.json();
}
