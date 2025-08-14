/**
 * 공통으로 사용되는 유틸리티 타입들
 */

/**
 * T 또는 null을 허용하는 타입
 */
export type Nullable<T> = T | null;

export type EmptyStringable<T> = T | '';

/**
 * T 또는 undefined를 허용하는 타입
 */
export type Undefinable<T> = T | undefined;

/**
 * T, null, undefined 모두 허용하는 타입
 */
export type Optional<T> = T | null | undefined;

/**
 * 객체의 모든 속성을 옵셔널로 만드는 타입 (Partial과 유사하지만 명시적)
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 객체의 특정 속성을 필수로 만드는 타입
 */
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * 배열 타입에서 단일 요소 타입 추출
 */
export type ArrayElement<T extends readonly unknown[]> =
  T extends readonly (infer U)[] ? U : never;

/**
 * 함수의 반환 타입이 Promise인 경우 래핑된 타입 추출
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
