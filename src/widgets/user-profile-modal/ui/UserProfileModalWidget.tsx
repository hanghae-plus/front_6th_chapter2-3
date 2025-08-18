import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/Dialog'
import { useUserProfileData } from '../model/useUserProfileData'

export const UserProfileModalWidget = () => {
  const { selectedUser, isLoading, showUserModal, handleCloseModal } = useUserProfileData()

  return (
    <Dialog open={showUserModal} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center">사용자 정보 로딩 중...</div>
          ) : selectedUser ? (
            <>
              <img
                src={selectedUser.image || ''}
                alt={selectedUser.username || ''}
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h3 className="text-xl font-semibold text-center">{selectedUser.username || ''}</h3>
              <div className="space-y-2">
                <p>
                  <strong>이름:</strong> {selectedUser.firstName || ''} {selectedUser.lastName || ''}
                </p>
                <p>
                  <strong>나이:</strong> {selectedUser.age || ''}
                </p>
                <p>
                  <strong>이메일:</strong> {selectedUser.email || ''}
                </p>
                <p>
                  <strong>전화번호:</strong> {selectedUser.phone || ''}
                </p>
                <p>
                  <strong>주소:</strong> {selectedUser.address?.address || ''}, {selectedUser.address?.city || ''},{' '}
                  {selectedUser.address?.state || ''}
                </p>
                <p>
                  <strong>직장:</strong> {selectedUser.company?.name || ''} - {selectedUser.company?.title || ''}
                </p>
              </div>
            </>
          ) : (
            <div>사용자 정보를 찾을 수 없습니다.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}