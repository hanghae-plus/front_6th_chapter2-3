export interface PaginationMeta {
  total: number;
  skip: number;
  limit: number;
}

export interface MutationProps<T> {
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: string;
}
