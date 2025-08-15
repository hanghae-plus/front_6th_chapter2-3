import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useFetchPostsModeStore } from "../posts/fetch-posts-by-mode/store/fetchMode.store"

export const useInitializeURL = () => {
  const [searchParams] = useSearchParams()
  const {
    action: { setMode },
  } = useFetchPostsModeStore()

  useEffect(() => {
    // URL 파라미터를 읽어서 store 상태와 동기화
    const search = searchParams.get("search") || ""
    const tag = searchParams.get("tag") || ""
    const sortBy = searchParams.get("sortBy") || "id"
    const order = searchParams.get("order") || "asc"
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = parseInt(searchParams.get("skip") || "0")

    // mode 결정 로직
    let mode: "list" | "search" | "tag" = "list"
    if (search) {
      mode = "search"
    } else if (tag && tag !== "all") {
      mode = "tag"
    }

    // store 상태 업데이트
    setMode({
      mode,
      limit,
      skip,
      sortBy: sortBy === "none" ? "" : sortBy,
      order,
      tag: tag === "all" ? "" : tag,
      q: search,
    })
  }, []) // 컴포넌트 마운트 시 한 번만 실행
}
