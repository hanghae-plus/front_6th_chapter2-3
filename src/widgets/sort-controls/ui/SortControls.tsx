import { useSortMode } from "../../../features/posts/fetch-posts-by-mode/hooks/useSortMode"
import SortBySelect from "./SortBySelect"
import OrderSelect from "./OrderSelect"

export default function SortControls() {
  const sortMode = useSortMode()
  return (
    <div className="flex gap-4">
      <SortBySelect sortMode={sortMode} />
      <OrderSelect sortMode={sortMode} />
    </div>
  )
}
