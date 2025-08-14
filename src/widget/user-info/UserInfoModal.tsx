import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"
import { User } from "../../entities/user/model/types"

interface UserInfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export const UserInfoModal = ({ open, onOpenChange, user }: UserInfoModalProps) => {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img src={user.image} alt={user.username} className="w-24 h-24 rounded-full mx-auto" />
          <h3 className="text-xl font-semibold text-center">{user.username}</h3>
          <div className="space-y-2">
            <p>
              <strong>사용자 ID:</strong> {user.id}
            </p>
            {user.fullName && (
              <p>
                <strong>이름:</strong> {user.fullName}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
