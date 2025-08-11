import { PolymorphicProp } from "@/shared/types"
import { VariantProps } from "class-variance-authority"
import { buttonVariants } from "./button.css"

export type ButtonProps = PolymorphicProp<"button", VariantProps<typeof buttonVariants>>
