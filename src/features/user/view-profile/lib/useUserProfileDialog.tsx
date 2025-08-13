import { useOverlay } from "../../../../shared/lib/use-overlay"
import { UserProfileDialog } from "../ui/UserProfileDialog"

export const useUserProfileDialog = () => {
  const { open, overlay } = useOverlay()

  const openProfile = (userId: number) =>
    open<void>(({ isOpen, close }) => <UserProfileDialog isOpen={isOpen} onClose={() => close()} userId={userId} />)

  return { openProfile, overlay }
}
