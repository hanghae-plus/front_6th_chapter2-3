import { DialogLayout, Textarea, Button } from "./index"

interface CommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  submitText: string
}

// 공통 다이얼로그 컴포넌트
export const CommentDialog = ({
  open,
  onOpenChange,
  title,
  placeholder,
  value,
  onChange,
  onSubmit,
  submitText,
}: CommentDialogProps) => (
  <DialogLayout open={open} onOpenChange={onOpenChange} title={title}>
    <div className="space-y-4">
      <Textarea placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      <Button onClick={onSubmit}>{submitText}</Button>
    </div>
  </DialogLayout>
)
