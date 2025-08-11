import "@testing-library/jest-dom"
import "@testing-library/jest-dom/vitest"

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// PointerEvent/hasPointerCapture 폴리필 (Radix UI용)
// jsdom 환경에서 필요한 API만 no-op으로 채워 안정화
if (!("PointerEvent" in window)) {
  // @ts-expect-error jsdom 환경 전용
  window.PointerEvent = MouseEvent
}
// @ts-expect-error jsdom 환경 전용
if (!Element.prototype.hasPointerCapture) {
  // @ts-expect-error jsdom 환경 전용
  Element.prototype.hasPointerCapture = () => false
}
// @ts-expect-error jsdom 환경 전용
if (!Element.prototype.setPointerCapture) {
  // @ts-expect-error jsdom 환경 전용
  Element.prototype.setPointerCapture = () => {}
}
// @ts-expect-error jsdom 환경 전용
if (!Element.prototype.releasePointerCapture) {
  // @ts-expect-error jsdom 환경 전용
  Element.prototype.releasePointerCapture = () => {}
}

// scrollIntoView 폴리필 (Radix Select 내부 사용)
// @ts-expect-error jsdom 환경 전용
if (!Element.prototype.scrollIntoView) {
  // @ts-expect-error jsdom 환경 전용
  Element.prototype.scrollIntoView = () => {}
}
