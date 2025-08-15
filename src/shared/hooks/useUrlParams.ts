import { useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export const useUrlParams = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const getParams = useCallback(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  const updateParams = useCallback(
    (newParams: string) => {
      const params = getParams()
      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value))
        } else {
          params.delete(key)
        }
      })
      navigate(`?${params.toString()}`)
    },
    [getParams, navigate],
  )

  return { getParams, updateParams }
}
