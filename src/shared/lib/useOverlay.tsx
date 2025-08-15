import { ReactNode, useCallback, useMemo, useState } from "react"

interface OverlayProps<T = unknown> {
  isOpen: boolean
  close: (result?: T) => void
}

export function useOverlay() {
  const [overlayElement, setOverlayElement] = useState<ReactNode | null>(null)

  const open = useCallback(<T,>(render: (props: OverlayProps<T>) => ReactNode): Promise<T | undefined> => {
    return new Promise<T | undefined>((resolve) => {
      const close = (result?: T) => {
        setOverlayElement(null)
        resolve(result)
      }

      setOverlayElement(render({ isOpen: true, close }))
    })
  }, [])

  return useMemo(
    () => ({
      open,
      overlay: overlayElement,
    }),
    [open, overlayElement],
  )
}
