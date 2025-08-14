import { useQuery } from "@tanstack/react-query"
import { postQueries } from "@/entities/post/model/queries"

export const usePostDetail = (id: number) => {
  const { data, isLoading, error } = useQuery(postQueries.detail(id))
  return { data, isLoading, error }
}
