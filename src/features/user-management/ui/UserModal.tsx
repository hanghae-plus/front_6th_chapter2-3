import { UserInfo } from "@/entities/post/model/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"

interface UserModalProps {
  onOpenChange: (open: boolean) => void
  open: boolean
  user: UserInfo | null
}

export function UserModal({ open, onOpenChange, user }: UserModalProps) {
  if (!user) return null

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img alt={user.username} className="w-24 h-24 rounded-full mx-auto" src={user.image} />
          <h3 className="text-xl font-semibold text-center">{user.username}</h3>
          <div className="space-y-2">
            <p>
              <strong>이름:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>나이:</strong> {user.age}
            </p>
            <p>
              <strong>이메일:</strong> {user.email}
            </p>
            <p>
              <strong>전화번호:</strong> {user.phone}
            </p>
            <p>
              <strong>주소:</strong> {user.address?.address}, {user.address?.city}, {user.address?.state}
            </p>
            <p>
              <strong>직장:</strong> {user.company?.name} - {user.company?.title}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
