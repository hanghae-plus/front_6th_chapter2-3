import type { User } from "@/entities/user/model"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"

interface UserProfileModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export const UserProfileModal = ({ user, isOpen, onClose }: UserProfileModalProps) => {
  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 사용자 프로필 이미지 */}
          <img src={user.image} alt={user.username} className="w-24 h-24 rounded-full mx-auto" />

          <h3 className="text-xl font-semibold text-center">{user.username}</h3>

          {/* 사용자 상세 정보 */}
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

          <div className="flex justify-end">
            <Button onClick={onClose}>닫기</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
