import { useEffect, useState } from "react"

export const useDebounceValue = <T>(value: T, delay = 300) => {
  const [debouncedValue, setDbouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDbouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, value])

  return debouncedValue
}
