import PaginationBar from "../PaginationBar"
import { useLimitMode } from "../../../features/posts/fetch-posts-by-mode/hooks/useLimitMode"
import { usePageNavigateMode } from "../../../features/posts/fetch-posts-by-mode/hooks/usePageNavigateMode"

export default function PaginationControls() {
  const limitMode = useLimitMode()
  const pageNavigateMode = usePageNavigateMode()

  return <PaginationBar limitMode={limitMode} pageNavigateMode={pageNavigateMode} />
}
