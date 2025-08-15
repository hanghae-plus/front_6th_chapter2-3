import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "./api";
import { usersKeys } from "../../../shared/query-keys/users";

export function useUsersQuery() {
  return useQuery({
    queryKey: usersKeys.all,
    queryFn: () => getAllUsers(),
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  });
}
