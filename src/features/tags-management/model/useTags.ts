import { useQuery } from "@tanstack/react-query"
import { fetchTagsApi } from "../../../entities/tags/api"

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchTagsApi,
  })
}
