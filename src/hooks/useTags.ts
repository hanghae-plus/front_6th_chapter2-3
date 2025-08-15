import { useQuery } from "@tanstack/react-query"
import { fetchTags } from "../shared/api/tags"

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  })
}
