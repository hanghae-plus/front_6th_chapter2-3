import { useUpdateURL } from "../../../update-URL/useUpdateURL"
import { useFetchPostsModeStore } from "../fetchMode.store"

export const useSortMode = () => {
  const { action, params } = useUpdateURL()
  const {
    state: { mode },
    action: { setMode },
  } = useFetchPostsModeStore()

  const updateSortAndOrderParams = (selectedSortBy: string, selectedOrder: string) => {
    if (selectedSortBy === "none") {
      action.updateSortAndOrderParams("", "")
      setMode({ mode, sortBy: "", order: "", skip: 0 })
    } else {
      action.updateSortAndOrderParams(selectedSortBy, selectedOrder)
      setMode({ mode, sortBy: selectedSortBy, order: selectedOrder, skip: 0 })
    }
  }

  return {
    param: {
      sortBy: params.sortBy || "",
      order: params.order || "",
    },
    update: updateSortAndOrderParams,
  }
}
