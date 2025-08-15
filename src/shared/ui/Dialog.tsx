import React from "react"

interface DialogLayoutProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const DialogLayout: React.FC<DialogLayoutProps> = ({ open, onOpenChange, title, children, className = "" }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div
        className={`relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  )
}

// 기존 컴포넌트들도 export (하위 호환성을 위해)
export const Dialog = DialogLayout
export const DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={className}>{children}</div>

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4">{children}</div>
)

export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
)
