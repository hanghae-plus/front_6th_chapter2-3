import { useEffect } from "react"
import { useAtom } from "jotai"
import { toastsAtom, type ToastItem } from "../lib/toastAtoms"

const ToastCard = ({ toast, onClose }: { toast: ToastItem; onClose: (id: string) => void }) => {
  useEffect(() => {
    const t = setTimeout(() => onClose(toast.id), toast.durationMs)
    return () => clearTimeout(t)
  }, [toast, onClose])
  const color =
    toast.type === "success"
      ? "bg-green-600"
      : toast.type === "warning"
        ? "bg-yellow-600"
        : toast.type === "error"
          ? "bg-red-600"
          : "bg-slate-700"
  return <div className={`text-white rounded px-3 py-2 shadow ${color}`}> {toast.message} </div>
}

export const ToastContainer = () => {
  const [toasts, setToasts] = useAtom(toastsAtom)
  const close = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onClose={close} />
      ))}
    </div>
  )
}
