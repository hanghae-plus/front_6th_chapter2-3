import { User } from "@entities/user/model/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui"

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  selectedUser: User | null
}

export const UserModal = ({ isOpen, onClose, selectedUser }: UserModalProps) => {
  if (!isOpen || !selectedUser) return null

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img alt={selectedUser.username} className="w-24 h-24 rounded-full mx-auto" src={selectedUser.image} />
          <h3 className="text-xl font-semibold text-center">{selectedUser.username}</h3>
          <div className="space-y-2">
            <p>
              <strong>이름:</strong> {selectedUser.firstName} {selectedUser.lastName}
            </p>
            <p>
              <strong>나이:</strong> {selectedUser.age}
            </p>
            <p>
              <strong>이메일:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>전화번호:</strong> {selectedUser.phone}
            </p>
            <p>
              <strong>주소:</strong> {selectedUser.address?.address}, {selectedUser.address?.city},{" "}
              {selectedUser.address?.state}
            </p>
            <p>
              <strong>직장:</strong> {selectedUser.company?.name} - {selectedUser.company?.title}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
