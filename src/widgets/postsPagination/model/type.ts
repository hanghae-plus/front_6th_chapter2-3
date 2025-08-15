export interface PostsPaginationProps {
  skip: number;
  limit: number;
  total: number;
  onSkipChange: (skip: number) => void;
  onLimitChange: (limit: number) => void;
}
