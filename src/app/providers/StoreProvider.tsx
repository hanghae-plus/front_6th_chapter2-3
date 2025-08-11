import { ReactNode } from "react"

// Zustand는 별도의 Provider가 필요하지 않지만,
// 향후 확장성을 위해 Provider 패턴을 유지합니다.
interface StoreProviderProps {
  children: ReactNode
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  return <>{children}</>
}
