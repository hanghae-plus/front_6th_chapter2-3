import { ApiClient } from "../../../shared/api/api"
import { Post, PostItem, CreatePost, UpdatePost, Tag } from "../model/types"

/**
 * PostAPI 클래스는 ApiClient를 상속받아 기본 경로를 설정하고,
 * 각 메서드에 대한 요청을 처리합니다.
 */
class PostAPI extends ApiClient {
  constructor() {
    super("/posts")
  }

  /**
   * 게시글 목록 조회
   * @param limit - 한 페이지에 표시할 게시글 수
   * @param skip - 건너뛸 게시글 수
   * @param sortBy - 정렬 기준
   * @param order - 정렬 순서
   * @returns 게시글 목록
   */
  async getPosts(limit: number, skip: number, sortBy?: string, order?: string): Promise<Post> {
    const params = new URLSearchParams()
    params.append("limit", limit.toString())
    params.append("skip", skip.toString())
    if (sortBy) params.append("sortBy", sortBy)
    if (order) params.append("order", order)

    return await this.get(`?${params.toString()}`)
  }

  /**
   * 검색어로 게시글 목록 조회
   * @param searchQuery - 검색어
   * @param limit - 한 페이지에 표시할 게시글 수
   * @param skip - 건너뛸 게시글 수
   * @param sortBy - 정렬 기준
   * @param order - 정렬 순서
   * @returns 검색 결과
   */
  async getPostsBySearch(
    searchQuery: string,
    limit: number,
    skip: number,
    sortBy?: string,
    order?: string,
  ): Promise<Post> {
    const params = new URLSearchParams()
    params.append("q", searchQuery)
    params.append("limit", limit.toString())
    params.append("skip", skip.toString())
    if (sortBy) params.append("sortBy", sortBy)
    if (order) params.append("order", order)

    return await this.get(`/search?${params.toString()}`)
  }

  /**
   * 태그 목록 조회
   * @returns 태그 목록
   */
  async getTags(): Promise<Tag[]> {
    return await this.get("/tags")
  }

  /**
   * 태그로 게시글 목록 조회
   * @param tag - 태그
   * @param limit - 한 페이지에 표시할 게시글 수
   * @param skip - 건너뛸 게시글 수
   * @param sortBy - 정렬 기준
   * @param order - 정렬 순서
   * @returns 태그 결과
   */
  async getPostsByTag(tag: string, limit: number, skip: number, sortBy?: string, order?: string): Promise<Post> {
    const params = new URLSearchParams()
    params.append("limit", limit.toString())
    params.append("skip", skip.toString())
    if (sortBy) params.append("sortBy", sortBy)
    if (order) params.append("order", order)

    return await this.get(`/tag/${tag}?${params.toString()}`)
  }

  /**
   * 게시글 추가
   * @param post - 추가할 게시글 정보
   * @returns 추가된 게시글 정보
   */
  async createPost(post: CreatePost): Promise<PostItem> {
    return await this.post("/add", post)
  }

  /**
   * 게시글 업데이트
   * @param id - 게시글 ID
   * @param post - 수정할 게시글 정보
   * @returns 수정된 게시글 정보
   */
  async updatePost(id: number, post: Partial<UpdatePost>): Promise<PostItem> {
    return await this.put(`/${id}`, post)
  }

  /**
   * 게시글 삭제
   * @param id - 게시글 ID
   * @returns 삭제 성공 여부
   */
  async deletePost(id: number): Promise<void> {
    return await this.delete(`/${id}`)
  }
}

/**
 * 싱글톤 인스턴스 생성
 */
export default new PostAPI()
