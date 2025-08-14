import { useQuery } from "@tanstack/react-query"
import { tagKeys } from "./tagQueryKeys"
import { tagApi } from "../api"

export const useTagsQuery = () => {
  return useQuery({
    queryKey: tagKeys.list(),
    queryFn: () => tagApi.getTags(),
  })
}
