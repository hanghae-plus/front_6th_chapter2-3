/**
 * 페이지네이션 관련 계산 유틸리티 함수들
 */

/**
 * 현재 페이지 번호 계산
 * @param skip - 건너뛴 항목 수
 * @param limit - 페이지당 항목 수
 * @returns 현재 페이지 번호 (1부터 시작)
 */
export const calculateCurrentPage = (skip: number, limit: number): number => {
  return Math.floor(skip / limit) + 1
}

/**
 * 전체 페이지 수 계산
 * @param total - 전체 항목 수
 * @param limit - 페이지당 항목 수
 * @returns 전체 페이지 수
 */
export const calculateTotalPages = (total: number, limit: number): number => {
  return Math.ceil(total / limit)
}

/**
 * 이전 페이지 버튼 비활성화 상태 계산
 * @param skip - 건너뛴 항목 수
 * @returns 이전 페이지 버튼이 비활성화되어야 하는지 여부
 */
export const isPreviousDisabled = (skip: number): boolean => {
  return skip === 0
}

/**
 * 다음 페이지 버튼 비활성화 상태 계산
 * @param skip - 건너뛴 항목 수
 * @param limit - 페이지당 항목 수
 * @param total - 전체 항목 수
 * @returns 다음 페이지 버튼이 비활성화되어야 하는지 여부
 */
export const isNextDisabled = (skip: number, limit: number, total: number): boolean => {
  return skip + limit >= total
}

/**
 * 페이지네이션 정보를 한 번에 계산
 * @param skip - 건너뛴 항목 수
 * @param limit - 페이지당 항목 수
 * @param total - 전체 항목 수
 * @returns 페이지네이션 정보 객체
 */
export const calculatePaginationInfo = (skip: number, limit: number, total: number) => {
  return {
    currentPage: calculateCurrentPage(skip, limit),
    totalPages: calculateTotalPages(total, limit),
    isPrevDisabled: isPreviousDisabled(skip),
    isNextDisabled: isNextDisabled(skip, limit, total),
  }
}
