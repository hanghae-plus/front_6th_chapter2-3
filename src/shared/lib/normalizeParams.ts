export function normalize<T extends Record<string, unknown>>(obj: T) {
  // 1) 비어있는 값 제거
  const entries = Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== "")
  // 2) 키 정렬로 일관성 확보
  entries.sort(([a], [b]) => (a > b ? 1 : -1))
  // 3) 원시 타입으로 단정
  return Object.fromEntries(entries) as Record<string, string | number | boolean>
}
