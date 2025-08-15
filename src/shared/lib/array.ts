// Generic array manipulation helpers based on id field
export const replaceById = <T extends { id: number }>(arr: T[], item: T): T[] =>
  arr.map((a) => (a.id === item.id ? item : a));

export const removeById = <T extends { id: number }>(arr: T[], id: number): T[] =>
  arr.filter((a) => a.id !== id);

export const upsertById = <T extends { id: number }>(arr: T[], item: T): T[] => {
  const exists = arr.some((a) => a.id === item.id);
  return exists ? replaceById(arr, item) : [item, ...arr];
};
