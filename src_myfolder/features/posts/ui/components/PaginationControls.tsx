import PaginationBar from "../../../../shared/ui/pagination/PaginationBar"
import { useLimitMode } from "../../fetch-posts-by-mode/hooks/useLimitMode"
import { usePageNavigateMode } from "../../fetch-posts-by-mode/hooks/usePageNavigateMode"

export default function PaginationControls() {
  const limitMode = useLimitMode()
  const pageNavigateMode = usePageNavigateMode()

  return <PaginationBar limitMode={limitMode} pageNavigateMode={pageNavigateMode} />
}
