import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';

interface AutoMutationProps<TData, TVariable> {
  fn: (v: TVariable) => Promise<TData>;
  invalidateKeys: QueryKey[];
  updateKey?: (data: TData) => { key: QueryKey; data: TData };
  successMessage?: string;
  errorMessage?: string;
}

export const useAutoMutation = <TData, TVariable>({
  fn,
  invalidateKeys,
  updateKey,
}: AutoMutationProps<TData, TVariable>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (data) => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      if (updateKey) {
        const { key, data: newData } = updateKey(data);
        queryClient.setQueryData(key, newData);
      }
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });
};
