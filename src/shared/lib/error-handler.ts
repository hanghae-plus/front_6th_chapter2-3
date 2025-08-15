export interface ApiError {
  status?: number
  message?: string
}

export const shouldRetry = (failureCount: number, error: Error): boolean => {
  const apiError = error as ApiError
  if (apiError?.status === 404 || apiError?.status === 403 || apiError?.status === 401) {
    return false
  }
  return failureCount < 3
}

export const handleQueryError = (error: Error): void => {
  const apiError = error as ApiError
  console.error('Query Error:', error)

  if (apiError.status === undefined) return

  if (apiError?.status === 401) {
    console.warn('인증이 필요합니다.')
  } else if (apiError?.status >= 500) {
    console.error('서버 오류가 발생했습니다.')
  }
}

export const handleMutationError = (error: Error): void => {
  const apiError = error as ApiError
  console.error('Mutation Error:', error)

  if (apiError.status === undefined) return

  if (apiError?.status === 401) {
    console.warn('인증이 필요합니다.')
  } else if (apiError?.status >= 500) {
    console.error('서버 오류가 발생했습니다.')
  } else if (apiError?.status === 400) {
    console.error('잘못된 요청입니다.')
  }
}
