import React from "react"
import { DialogContent } from "../dialog-content"
import { DialogHeader } from "../dialog-header"
import { DialogTitle } from "../dialog-title"
import { Dialog as DialogWrapper } from "../index"
import { DialogProps } from "./type"

export const Dialog: React.FC<DialogProps> = ({ open, handleChange, children, title }) => {
  return (
    <DialogWrapper open={open} onOpenChange={handleChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </DialogWrapper>
  )
}
