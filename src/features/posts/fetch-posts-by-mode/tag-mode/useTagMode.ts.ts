import { useUpdateURL } from "../../../update-URL/useUpdateURL"
import { initialMode, useFetchPostsModeStore } from "../fetchMode.store"

export const useTagMode = () => {
  const { action, params } = useUpdateURL()
  const { setMode } = useFetchPostsModeStore()

  /**
   * 태그 파라미터 업데이트
   * @param tag 태그 파라미터
   */
  const updateTagParams = (tag: string) => {
    action.updateTagParams(tag)
    if (tag === "all") {
      setMode(initialMode)
    } else {
      setMode({ type: "tag", tag })
    }
  }

  return {
    param: params.tag || "",
    update: updateTagParams,
  }
}
