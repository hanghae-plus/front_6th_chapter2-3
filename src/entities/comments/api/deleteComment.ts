import fetchClient from "../../../shared/api/fetchClient"

export const deleteCommentApi = async (id: number): Promise<void> => {
  return fetchClient<void>(`/comments/${id}`, {
    method: "DELETE",
  })
}
