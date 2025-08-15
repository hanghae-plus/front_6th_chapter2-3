import { atom } from "jotai"

export type ToastType = "info" | "success" | "warning" | "error"

export interface ToastItem {
  id: string
  message: string
  type: ToastType
  createdAt: number
  durationMs: number
}

export const toastsAtom = atom<ToastItem[]>([])
