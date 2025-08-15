import { useGetUserDetail } from "@entities/user/hooks/queries/useGetUserDetail"
import { useUserModalStore } from "@entities/user/stores/useUserModalStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/components/dialog"
import { useShallow } from "zustand/shallow"

export const UserModal = () => {
  const { selectedUserId, isOpenUserModal, setIsOpenUserModal } = useUserModalStore(
    useShallow((state) => ({
      selectedUserId: state.selectedUserId,
      isOpenUserModal: state.isOpenUserModal,
      setIsOpenUserModal: state.actions.setIsOpenUserModal,
    })),
  )
  const { data: selectedUser } = useGetUserDetail(selectedUserId || 0, {
    enabled: !!selectedUserId && isOpenUserModal,
  })

  return (
    <Dialog open={isOpenUserModal} onOpenChange={setIsOpenUserModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img src={selectedUser?.image} alt={selectedUser?.username} className="w-24 h-24 rounded-full mx-auto" />
          <h3 className="text-xl font-semibold text-center">{selectedUser?.username}</h3>
          <div className="space-y-2">
            <p>
              <strong>이름:</strong> {selectedUser?.firstName} {selectedUser?.lastName}
            </p>
            <p>
              <strong>나이:</strong> {selectedUser?.age}
            </p>
            <p>
              <strong>이메일:</strong> {selectedUser?.email}
            </p>
            <p>
              <strong>전화번호:</strong> {selectedUser?.phone}
            </p>
            <p>
              <strong>주소:</strong> {selectedUser?.address?.address}, {selectedUser?.address?.city},{" "}
              {selectedUser?.address?.state}
            </p>
            <p>
              <strong>직장:</strong> {selectedUser?.company?.name} - {selectedUser?.company?.title}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
