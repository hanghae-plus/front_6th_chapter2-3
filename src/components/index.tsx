import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Check, ChevronDown, X } from 'lucide-react'
import { cva, VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-blue-500 text-white hover:bg-blue-600',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
        link: 'underline-offset-4 hover:underline text-blue-500',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-8 px-3 rounded-md text-xs',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  className?: string
}

export const Button = ({ className, variant, size, ...props }: IButtonProps) => {
  return <button className={buttonVariants({ variant, size, className })} {...props} />
}

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  type?: string
  ref?: React.Ref<HTMLInputElement>
}

export const Input = ({ className, type, ref, ...props }: IInputProps) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  )
}

interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

export const Card = ({ className, ref, ...props }: ICardProps) => {
  return (
    <div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
  )
}

interface ICardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

export const CardHeader = ({ className, ref, ...props }: ICardHeaderProps) => {
  return <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
}

interface ICardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
  ref?: React.Ref<HTMLHeadingElement>
}

export const CardTitle = ({ className, ref, ...props }: ICardTitleProps) => {
  return <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
}

interface ICardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

export const CardContent = ({ className, ref, ...props }: ICardContentProps) => {
  return <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
}

interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  ref?: React.Ref<HTMLTextAreaElement>
}

export const Textarea = ({ className, ref, ...props }: ITextareaProps) => {
  return (
    <textarea
      className={`flex min-h-[150px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  )
}

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

interface ISelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children?: React.ReactNode
  ref?: React.Ref<HTMLButtonElement>
}

export const SelectTrigger = ({ className, children, ref, ...props }: ISelectTriggerProps) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={`flex h-10 items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </SelectPrimitive.Trigger>
)

interface ISelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  position?: SelectPrimitive.SelectContentProps['position']
  ref?: React.Ref<HTMLDivElement>
}

export const SelectContent = ({ className, children, position = 'popper', ref, ...props }: ISelectContentProps) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
)

interface ISelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  value: string
  ref?: React.Ref<HTMLDivElement>
}

export const SelectItem = ({ className, children, ref, ...props }: ISelectItemProps) => (
  <SelectPrimitive.Item
    ref={ref}
    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
)

// 대화상자 컴포넌트
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogOverlay = DialogPrimitive.Overlay

interface IDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

export const DialogContent = ({ className, children, ref, ...props }: IDialogContentProps) => (
  <DialogPortal>
    <DialogOverlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full ${className}`}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">닫기</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
)

interface IDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  ref?: React.Ref<HTMLDivElement>
}

export const DialogHeader = ({ className, ref, ...props }: IDialogHeaderProps) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />
)

interface IDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
  ref?: React.Ref<HTMLHeadingElement>
}

export const DialogTitle = ({ className, ref, ...props }: IDialogTitleProps) => (
  <DialogPrimitive.Title
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
)

// 테이블 컴포넌트
interface ITableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string
  ref?: React.Ref<HTMLTableElement>
}

export const Table = ({ className, ref, ...props }: ITableProps) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={`table-fixed w-full caption-bottom text-sm ${className}`} {...props} />
  </div>
)

interface ITableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
  ref?: React.Ref<HTMLTableSectionElement>
}

export const TableHeader = ({ className, ref, ...props }: ITableHeaderProps) => (
  <thead ref={ref} className={`[&_tr]:border-b ${className}`} {...props} />
)

interface ITableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
  ref?: React.Ref<HTMLTableSectionElement>
}

export const TableBody = ({ className, ref, ...props }: ITableBodyProps) => (
  <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
)

interface ITableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string
  ref?: React.Ref<HTMLTableRowElement>
}

export const TableRow = ({ className, ref, ...props }: ITableRowProps) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className}`}
    {...props}
  />
)

interface ITableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string
  ref?: React.Ref<HTMLTableCellElement>
}

export const TableHead = ({ className, ref, ...props }: ITableHeadProps) => (
  <th
    ref={ref}
    className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  />
)

interface ITableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string
  ref?: React.Ref<HTMLTableCellElement>
}

export const TableCell = ({ className, ref, ...props }: ITableCellProps) => (
  <td ref={ref} className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
)
