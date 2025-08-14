import { useUpdateURL } from "../../../update-URL/useUpdateURL"
import { useFetchPostsModeStore } from "../store/fetchMode.store"

export const useLimitMode = () => {
  const { action, params } = useUpdateURL()
  const {
    action: { setMode },
    state: { mode },
  } = useFetchPostsModeStore()

  const updateLimitParams = (value: number) => {
    action.updateLimitParams(value)
    setMode({ mode, limit: value, skip: 0 })
  }

  return {
    param: params.limit,
    update: updateLimitParams,
  }
}
