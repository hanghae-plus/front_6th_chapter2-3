interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  ref?: React.Ref<HTMLTextAreaElement>
}

export default function Textarea({ className, ref, ...props }: ITextareaProps) {
  return (
    <textarea
      className={`flex min-h-[150px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  )
}
