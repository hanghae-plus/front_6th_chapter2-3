import { useProfileDialogStore } from '../model/profileDialogStore';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui';

export const UserProfileDialog = () => {
  const { userToView, isModalOpen, closeModal } = useProfileDialogStore();

  if (!userToView) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <img
            src={userToView.image}
            alt={userToView.username}
            className='w-24 h-24 rounded-full mx-auto'
          />
          <h3 className='text-xl font-semibold text-center'>{userToView.username}</h3>
          <div className='space-y-2'>
            <p>
              <strong>이름:</strong> {userToView.firstName} {userToView.lastName}
            </p>
            <p>
              <strong>나이:</strong> {userToView.age}
            </p>
            <p>
              <strong>이메일:</strong> {userToView.email}
            </p>
            <p>
              <strong>전화번호:</strong> {userToView.phone}
            </p>
            <p>
              <strong>주소:</strong> {userToView.address?.address}, {userToView.address?.city},{' '}
              {userToView.address?.state}
            </p>
            <p>
              <strong>직장:</strong> {userToView.company?.name} - {userToView.company?.title}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
