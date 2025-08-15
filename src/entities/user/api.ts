import { http } from '@shared/lib/http-client'
import { IUser } from '@shared/model'

interface IFetchUsersResponse {
  limit: number
  skip: number
  total: number
  users: IUser[]
}

/**
 * 사용자 목록 조회
 * @param limit - 한 페이지에 보여지는 사용자 수
 * @returns 사용자 목록
 */
export async function fetchUsers({ limit }: { limit: number }): Promise<IFetchUsersResponse> {
  const searchParams = { limit, select: 'username,image' }
  const response = await http.get<IFetchUsersResponse>(`/users`, {
    params: searchParams,
  })
  return response
}

/**
 * 사용자 상세 조회
 * @param id - 사용자 ID
 * @returns 사용자 정보
 */
export async function fetchUserById({ id }: { id: number }) {
  const response = await http.get(`/users/${id}`, { params: { select: 'username,image' } })
  return response
}
