import { useUpdateURL } from "../../../update-URL/useUpdateURL"
import { useFetchPostsModeStore } from "../fetchMode.store"

export const useTagMode = () => {
  const { action, params } = useUpdateURL()
  const {
    action: { setMode },
  } = useFetchPostsModeStore()

  /**
   * 태그 파라미터 업데이트
   * @param tag 태그 파라미터
   */
  const updateTagParams = (tag: string) => {
    action.updateTagParams(tag)
    if (tag === "all") {
      setMode({ mode: "list", skip: 0 })
    } else {
      setMode({ mode: "tag", tag, skip: 0 })
    }
  }

  return {
    param: params.tag || "",
    update: updateTagParams,
  }
}
