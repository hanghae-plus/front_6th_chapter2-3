import fetchClient from "../../../shared/api/fetchClient"

export const deletePostApi = async (id: number): Promise<void> => {
  return fetchClient<void>(`/posts/${id}`, {
    method: "DELETE",
  })
}
