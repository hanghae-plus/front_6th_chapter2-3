import fetchClient from "../../../shared/utils/fetchClient"

export const deleteCommentApi = async (id: number): Promise<void> => {
  return fetchClient<void>(`/comments/${id}`, {
    method: "DELETE",
  })
}
