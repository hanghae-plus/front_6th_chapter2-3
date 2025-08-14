import { useUpdateURL } from "../../../update-URL/useUpdateURL"
import { useFetchPostsModeStore } from "../fetchMode.store"
import { useFetchPostsByMode } from "../useFetchPostsByMode"

export const usePageNavigateMode = () => {
  const { action, params } = useUpdateURL()
  const { total } = useFetchPostsByMode()
  const { skip, limit } = params
  const {
    action: { setMode },
    state: { mode },
  } = useFetchPostsModeStore()

  const nextPage = () => {
    action.updateSkipParams(skip + limit)
    setMode({ mode, skip: skip + limit })
  }

  const prevPage = () => {
    action.updateSkipParams(skip - limit)
    setMode({ mode, skip: skip - limit })
  }

  const nextDisabled = skip + limit >= total
  const prevDisabled = skip === 0

  return {
    state: { nextDisabled, prevDisabled },
    action: { nextPage, prevPage },
  }
}
