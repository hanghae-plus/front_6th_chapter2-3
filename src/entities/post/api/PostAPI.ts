import { ApiClient } from "../../../shared/api/api"
import { CreatePost } from "../model/types"

/**
 * PostAPI 클래스는 ApiClient를 상속받아 기본 경로를 설정하고,
 * 각 메서드에 대한 요청을 처리합니다.
 */
class PostAPI extends ApiClient {
  constructor() {
    super("/api/posts")
  }

  /**
   * 게시글 목록 조회
   * @param limit - 한 페이지에 표시할 게시글 수
   * @param skip - 건너뛸 게시글 수
   * @returns 게시글 목록
   */
  async getPosts(limit: number, skip: number) {
    return await this.get(`?limit=${limit}&skip=${skip}`)
  }

  /**
   * 검색어로 게시글 목록 조회
   * @param searchQuery - 검색어
   * @returns 검색 결과
   */
  async getPostsBySearch(searchQuery: string) {
    return await this.get(`/search?q=${searchQuery}`)
  }

  /**
   * 태그 목록 조회
   * @returns 태그 목록
   */
  async getTags() {
    return await this.get("/tags")
  }

  /**
   * 태그로 게시글 목록 조회
   * @param tag - 태그
   * @returns 태그 결과
   */
  async getPostsByTag(tag: string) {
    return await this.get(`/tag/${tag}`)
  }

  /**
   * 게시글 추가
   * @param post - 추가할 게시글 정보
   * @returns 추가된 게시글 정보
   */
  async createPost(post: CreatePost) {
    return await this.post("/add", post)
  }

  /**
   * 게시글 업데이트
   * @param id - 게시글 ID
   * @param post - 수정할 게시글 정보
   * @returns 수정된 게시글 정보
   */
  async updatePost(id: number, post: CreatePost) {
    return await this.put(`/${id}`, post)
  }

  /**
   * 게시글 삭제
   * @param id - 게시글 ID
   * @returns 삭제된 게시글 정보
   */
  async deletePost(id: number) {
    return await this.delete(`/${id}`)
  }
}

/**
 * 싱글톤 인스턴스 생성
 */
export default new PostAPI()
