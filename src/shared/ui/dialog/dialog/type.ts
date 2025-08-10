export interface DialogProps {
  open: boolean
  title: string | React.ReactNode
  handleChange: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}
