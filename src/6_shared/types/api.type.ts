import { Post } from '@/entities/post';

export interface PaginationResponse {
  total: number;
  skip: number;
  limit: number;
}

export interface MutationProps<T> {
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
}
