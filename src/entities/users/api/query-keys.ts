export const USER_QUERY_KEYS = {
  users: () => ['users'] as const,
  user: (userId: number) => ['users', userId] as const,
} as const;
