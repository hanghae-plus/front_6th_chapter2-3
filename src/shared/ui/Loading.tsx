import { Loader2 } from "lucide-react"

export function Loading({ text = "로딩 중..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 p-4">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{text}</span>
    </div>
  )
}
