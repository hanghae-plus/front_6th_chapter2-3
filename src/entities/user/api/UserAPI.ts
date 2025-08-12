import { ApiClient } from "../../../shared/api/api"

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
  async getUsers(limit: number, select: string) {
    return await this.get(`?limit=${limit}&select=${select}`)
  }

  /**
   * 사용자 정보 조회
   * @param id - 사용자 ID
   * @returns 사용자 정보
   */
  async getUser(id: number) {
    return await this.get(`/${id}`)
  }
}

export default new UserAPI()
