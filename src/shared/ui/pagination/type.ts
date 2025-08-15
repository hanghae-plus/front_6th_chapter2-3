export interface PaginationProps {
  limit: number
  skip: number
  total: number
  setSkip: (value: React.SetStateAction<number>) => void
  setLimit: (value: React.SetStateAction<number>) => void
}
