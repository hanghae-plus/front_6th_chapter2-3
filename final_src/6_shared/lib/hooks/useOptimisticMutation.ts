import React from 'react';

import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

// 타입 정의
export interface OptimisticMutationConfig<TCacheData, TData, TVariables>
  extends Omit<
    UseMutationOptions<TData, Error, TVariables>,
    'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > {
  queryKey: QueryKey;
  queryKeyToCancel?: QueryKey;
  optimisticUpdate: (
    variables: TVariables,
    oldData: TCacheData | undefined
  ) => TCacheData;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (
    data: TData | undefined,
    error: Error | null,
    variables: TVariables
  ) => void;
}

export interface OptimisticContext<TCacheData, TData, TVariables> {
  previousData: TCacheData | undefined;
  variables: TVariables;
}

/**
 * 낙관적 업데이트를 위한 커스텀 훅
 *
 * FSD Best Practice:
 * - 재사용 가능한 로직 추상화
 * - 타입 안전성 보장
 * - 일관된 에러 처리
 * - 자동 롤백 기능
 */
export const useOptimisticMutation = <TCacheData, TData, TVariables>({
  queryKey,
  queryKeyToCancel,
  optimisticUpdate,
  onSuccess,
  onError,
  onSettled,
  ...mutationOptions
}: OptimisticMutationConfig<TCacheData, TData, TVariables>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutationOptions,
    onMutate: async (variables: TVariables) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: queryKeyToCancel || queryKey,
      });

      // 이전 데이터 백업
      const previousData = queryClient.getQueryData<TCacheData>(queryKey);

      // 낙관적 업데이트 적용
      queryClient.setQueryData(
        queryKey,
        optimisticUpdate(variables, previousData)
      );

      // 롤백을 위한 컨텍스트 반환
      return { previousData, variables };
    },
    onError: (
      error: Error,
      variables: TVariables,
      _context: OptimisticContext<TCacheData, TData, TVariables> | undefined
    ) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (_context?.previousData !== undefined) {
        queryClient.setQueryData(queryKey, _context.previousData);
      }

      // 사용자 정의 에러 처리
      onError?.(error, variables);
    },
    onSuccess: (
      data: TData,
      variables: TVariables,
      _context: OptimisticContext<TCacheData, TData, TVariables> | undefined
    ) => {
      // 성공 시 서버 데이터로 업데이트 (필요시)
      queryClient.setQueryData(queryKey, data as any);

      // 사용자 정의 성공 처리
      onSuccess?.(data, variables);
    },
    onSettled: (
      data: TData | undefined,
      error: Error | null,
      variables: TVariables,
      _context: OptimisticContext<TCacheData, TData, TVariables> | undefined
    ) => {
      // 완료 시 사용자 정의 처리
      onSettled?.(data, error, variables);
    },
  });
};
