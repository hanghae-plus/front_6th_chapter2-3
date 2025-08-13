import "@testing-library/jest-dom"

import * as matchers from "@testing-library/jest-dom/matchers"
import { setupServer } from "msw/node"
import { afterAll, afterEach, beforeAll, expect } from "vitest"

import { handlers, resetMockData } from "./msw/handlers"

expect.extend(matchers)

// JSDOM 환경에서 누락된 DOM 메서드들을 polyfill
if (typeof Element !== "undefined") {
  // 포인터 이벤트 관련 메서드들
  Element.prototype.hasPointerCapture =
    Element.prototype.hasPointerCapture ||
    function () {
      return false
    }
  Element.prototype.setPointerCapture = Element.prototype.setPointerCapture || function () {}
  Element.prototype.releasePointerCapture = Element.prototype.releasePointerCapture || function () {}

  // 스크롤 관련 메서드
  Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || function () {}
}

// 기본 URL 설정
Object.defineProperty(global, "location", {
  value: {
    origin: "http://localhost:3000",
    href: "http://localhost:3000",
    protocol: "http:",
    host: "localhost:3000",
    hostname: "localhost",
    port: "3000",
    pathname: "/",
    search: "",
    hash: "",
  },
  writable: true,
})

// MSW 서버 설정
export const server = setupServer(...handlers)

// 모든 테스트 실행 전 서버 시작
beforeAll(() => {
  server.listen({
    onUnhandledRequest: "warn",
  })
})

// 각 테스트 후 핸들러 리셋 및 목 데이터 리셋
afterEach(() => {
  server.resetHandlers()
  resetMockData()
})

// 모든 테스트 완료 후 서버 종료
afterAll(() => {
  server.close()
})
