export interface DialogProps {
  open: boolean
  title: string | React.ReactNode
  handleChange: (open: boolean) => void
  children: React.ReactNode
}
