import { ApiClient } from "../../../shared/api/api"
import { User } from "../model/types"

class UserAPI extends ApiClient {
  constructor() {
    super("/api/users")
  }

  /**
   * 사용자 목록 조회
   * @param limit - 한 페이지에 표시할 사용자 수
   * @param select - 선택할 필드
   * @returns 사용자 목록
   */
  async getUserList(limit: number, select: string): Promise<User[]> {
    return await this.get<User[]>(`?limit=${limit}&select=${select}`)
  }

  /**
   * 사용자 정보 조회
   * @param id - 사용자 ID
   * @returns 사용자 정보
   */
  async getUserInfo(id: number): Promise<User> {
    return await this.get<User>(`/${id}`)
  }
}

export default new UserAPI()
