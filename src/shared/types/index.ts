import type { ComponentProps, ElementType } from "react"

export type PolymorphicProp<E extends ElementType, T> = Omit<ComponentProps<E>, keyof T> & {
  as?: E
  asChild?: boolean
} & T
