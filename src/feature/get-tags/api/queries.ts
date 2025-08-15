import { useQuery } from "@tanstack/react-query"

import { TagApi } from "@/entities/tag"

export const useGetTags = () => {
  return useQuery({
    queryFn: TagApi.getAll,
    queryKey: ["tags"],
  })
}
