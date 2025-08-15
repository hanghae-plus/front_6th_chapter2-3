export interface PaginationProps {
  total: number
  limit: number
  onLimitChange: (limit: number) => void
  skip: number
  onSkipChange: (skip: number) => void
}
