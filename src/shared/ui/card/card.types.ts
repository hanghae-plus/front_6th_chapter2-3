import { HTMLAttributes } from "react"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  ref: React.Ref<HTMLDivElement>
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref: React.Ref<HTMLDivElement>
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  ref: React.Ref<HTMLHeadingElement>
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  ref: React.Ref<HTMLDivElement>
}
