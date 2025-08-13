import { useSearchParams } from '@/shared/lib';

export const useSkip = () => useSearchParams<number>('skip', '0', parseInt);

export const useLimit = () => useSearchParams<number>('limit', '10', parseInt);

export const useSearchQuery = () => useSearchParams<string>('search', '');

export const useSortBy = () => useSearchParams<string>('sortBy', '');

export const useSortOrder = () => useSearchParams<string>('sortOrder', 'asc');

export const useTag = () => useSearchParams<string>('tag', '');
