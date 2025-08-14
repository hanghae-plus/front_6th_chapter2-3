import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "../api/tags";

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });
};
