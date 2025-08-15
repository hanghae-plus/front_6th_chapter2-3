// Helper to wrap async tasks with a loading flag atom
export async function runWithLoading<T>(
  set: (atom: any, value: any) => void,
  loadingAtom: any,
  task: () => Promise<T>,
): Promise<T> {
  set(loadingAtom, true);
  try {
    return await task();
  } finally {
    set(loadingAtom, false);
  }
}
