import { selectedCommentType } from '../model/types'
const API_BASE_URL = import.meta.env.PROD ? 'https://dummyjson.com' : '/api'

export const updateCommentApi = async (
  selectedComment: selectedCommentType
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/comments/${selectedComment.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: selectedComment.body }),
      }
    )
    return await response.json()
  } catch (error) {
    console.error('댓글 업데이트 오류:', error)
  }
}
