export interface BaseProps {
  className?: string;
}

export interface BasePropsWithChildren extends BaseProps {
  children: React.ReactNode;
}

export interface User {
  id: number;
  username: string;
  image: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  email?: string;
  phone?: string;
  address?: {
    address: string;
    city: string;
    state: string;
  };
  company?: {
    name: string;
    title: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}
