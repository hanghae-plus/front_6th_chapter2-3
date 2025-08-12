import type { QueryClient, QueryKey } from "@tanstack/react-query"

/**
 * Applies an update function to a set of query [key,data] pairs and returns a rollback function.
 * Optionally accepts a predicate to limit which pairs are updated.
 */
export function updateQueriesWithRollback<Data>(
  queryClient: QueryClient,
  pairs: Array<[QueryKey, Data | undefined]>,
  apply: (prev: Data, key: QueryKey) => Data,
  when?: (args: { key: QueryKey; data: Data | undefined }) => boolean,
) {
  const previousPairs = pairs.map(([key, data]) => [key, data] as const)

  for (const [key, data] of pairs) {
    if (data == null) continue
    if (when && !when({ key, data })) continue
    queryClient.setQueryData<Data>(key, apply(data, key))
  }

  return () => {
    for (const [key, data] of previousPairs) {
      queryClient.setQueryData<typeof data>(key, data)
    }
  }
}
