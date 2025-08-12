import { ApiClient } from "../../../shared/api/api"
import { CreateComment } from "../model/types"

class CommentAPI extends ApiClient {
  constructor() {
    super("/api/comments")
  }

  /**
   * 댓글 목록 조회
   * @param postId - 게시글 ID
   * @returns 댓글 목록
   */
  async getComments(postId: number) {
    return await this.get(`/post/${postId}`)
  }

  /**
   * 댓글 추가
   * @param comment - 추가할 댓글 정보
   * @returns 추가된 댓글 정보
   */
  async createComment(comment: CreateComment) {
    return await this.post("/add", comment)
  }

  /**
   * 댓글 수정
   * @param id - 수정할 댓글 ID
   * @param comment - 수정할 댓글 정보
   * @returns 수정된 댓글 정보
   */
  async updateComment(id: number, comment: CreateComment) {
    return await this.put(`/${id}`, comment)
  }

  /**
   * 댓글 삭제
   * @param id - 삭제할 댓글 ID
   * @returns 삭제된 댓글 정보
   */
  async deleteComment(id: number) {
    return await this.delete(`/${id}`)
  }

  /**
   * 댓글 좋아요
   * @param id - 좋아요할 댓글 ID
   * @returns 좋아요된 댓글 정보
   */
  async likeComment(id: number) {
    return await this.patch(`/${id}`, { likes: 1 })
  }
}

export default new CommentAPI()
