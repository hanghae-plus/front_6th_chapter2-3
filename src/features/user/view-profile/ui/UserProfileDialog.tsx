import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui"
import { UserDetail } from "@entities/user/ui"

interface UserProfileDialogProps {
  isOpen: boolean
  onClose: () => void
  userId: number
}

export const UserProfileDialog = ({ isOpen, onClose, userId }: UserProfileDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <UserDetail userId={userId} />
      </DialogContent>
    </Dialog>
  )
}
