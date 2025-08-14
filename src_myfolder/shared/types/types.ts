export type ListResponse<K extends string, T> = { total: number; skip: number; limit: number } & Record<K, T[]>
