import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import type { ComponentPropsWithRef } from "react"

import { mergeClasses } from "../utils/classUtils"

const DialogRoot = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogOverlay = DialogPrimitive.Overlay

type DialogContentProps = ComponentPropsWithRef<typeof DialogPrimitive.Content>
type DialogHeaderProps = ComponentPropsWithRef<"div">
type DialogTitleProps = ComponentPropsWithRef<typeof DialogPrimitive.Title>

function DialogContent({ className, children, ...rest }: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content
        className={mergeClasses(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
          className,
        )}
        {...rest}
      >
        {children}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">닫기</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...rest }: DialogHeaderProps) {
  return <div className={mergeClasses("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...rest} />
}

function DialogTitle({ className, ...rest }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      className={mergeClasses("text-lg font-semibold leading-none tracking-tight", className)}
      {...rest}
    />
  )
}

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
})
