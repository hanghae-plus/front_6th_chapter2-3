import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import type { UserId } from "@/entities/User"
import { useQueryUser } from "@/features/user/api/useQueryUser"
import { useUserModal } from "@/features/user/model/useUserModal.ts"

function UserDialogContent({ userId }: { userId: UserId }) {
  const { data: user } = useQueryUser(userId)
  if (!user) return null

  return (
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
        <strong>주소:</strong> {user.address.address}, {user.address.city}, {user.address.state}
      </p>
      <p>
        <strong>직장:</strong> {user.company.name} - {user.company.title}
      </p>
    </div>
  )
}

export function UserDialogDetail() {
  const { showUserModal, setShowUserModal, selectedUser } = useUserModal()
  if (!selectedUser) return null

  return (
    <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 min-h-[340px]">
          <img src={selectedUser.image} alt={selectedUser.username} className="w-24 h-24 rounded-full mx-auto" />

          <h3 className="text-xl font-semibold text-center">{selectedUser.username}</h3>

          <UserDialogContent userId={selectedUser.id} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
