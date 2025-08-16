import { useQuery } from "@tanstack/react-query"

import { getTags } from "./index"

export const useTagListQuery = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  });
};