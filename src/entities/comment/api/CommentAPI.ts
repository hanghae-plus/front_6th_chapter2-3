import { ApiClient } from "../../../shared/api/api"
import { CreateComment, CommentList, UpdateComment, LikeComment, Comment } from "../model/types"

class CommentAPI extends ApiClient {
  constructor() {
    super("/api/comments")
  }

  /**
   * 댓글 목록 조회
   * @param postId - 게시글 ID
   * @returns 댓글 목록
   */
  async getComments(postId: number): Promise<CommentList> {
    return await this.get<CommentList>(`/post/${postId}`)
  }

  /**
   * 댓글 추가
   * @param comment - 추가할 댓글 정보
   * @returns 추가된 댓글 정보
   */
  async createComment(comment: CreateComment): Promise<Comment> {
    return await this.post<Comment>("/add", comment)
  }

  /**
   * 댓글 수정
   * @param id - 수정할 댓글 ID
   * @param comment - 수정할 댓글 정보
   * @returns 수정된 댓글 정보
   */
  async updateComment(id: number, comment: UpdateComment): Promise<Comment> {
    return await this.put<Comment>(`/${id}`, comment)
  }

  /**
   * 댓글 삭제
   * @param id - 삭제할 댓글 ID
   * @returns 삭제된 댓글 정보
   */
  async deleteComment(id: number): Promise<Comment> {
    return await this.delete<Comment>(`/${id}`)
  }

  /**
   * 댓글 좋아요
   * @param id - 좋아요할 댓글 ID
   * @returns 좋아요된 댓글 정보
   */
  async likeComment(id: number): Promise<Comment> {
    return await this.patch<Comment>(`/${id}`, { likes: 1 })
  }
}

export default new CommentAPI()
