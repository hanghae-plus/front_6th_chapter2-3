import type { PolymorphicProp } from "@/shared/types"

import type { buttonVariants } from "./button.css"
import type { VariantProps } from "class-variance-authority"

export type ButtonProps = PolymorphicProp<"button", VariantProps<typeof buttonVariants>>
