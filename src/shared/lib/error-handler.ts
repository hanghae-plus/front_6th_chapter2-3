// import { ApiError } from "./api-types"

// export class ErrorHandler {
//   // API 에러를 사용자 친화적인 메시지로 변환
//   static getErrorMessage(error: any): string {
//     if (error.response?.data?.message) {
//       return error.response.data.message
//     }

//     if (error.message) {
//       return error.message
//     }

//     return "알 수 없는 오류가 발생했습니다."
//   }

//   // 에러 타입별 처리
//   static handleError(error: any, context?: string) {
//     const message = this.getErrorMessage(error)
//     const status = error.response?.status

//     console.error(`[${context || "API"}] 오류:`, {
//       message,
//       status,
//       error,
//     })

//     // 상태 코드별 처리
//     switch (status) {
//       case 400:
//         console.warn("잘못된 요청입니다.")
//         break
//       case 401:
//         console.warn("인증이 필요합니다.")
//         break
//       case 403:
//         console.warn("접근 권한이 없습니다.")
//         break
//       case 404:
//         console.warn("요청한 리소스를 찾을 수 없습니다.")
//         break
//       case 500:
//         console.error("서버 오류가 발생했습니다.")
//         break
//       default:
//         console.error("네트워크 오류가 발생했습니다.")
//     }

//     return { message, status }
//   }
// }

// export default ErrorHandler
