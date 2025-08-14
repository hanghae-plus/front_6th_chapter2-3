import { useUserModalStore } from '../model/store';
import { useGetUser } from '@/entities/users';
import { Dialog } from '@/shared/ui/dialog';

const UserInfoDialog = () => {
  const { showUserModal, selectedUser, closeUserModal } = useUserModalStore();

  const { data } = useGetUser(selectedUser?.id as number);
  return (
    <Dialog open={showUserModal} onOpenChange={closeUserModal}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>사용자 정보</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4">
          <img
            src={selectedUser?.image}
            alt={selectedUser?.username}
            className="w-24 h-24 rounded-full mx-auto"
          />
          <h3 className="text-xl font-semibold text-center">
            {selectedUser?.username}
          </h3>
          <div className="space-y-2">
            <p>
              <strong>이름:</strong> {data?.firstName} {data?.lastName}
            </p>
            <p>
              <strong>나이:</strong> {data?.age}
            </p>
            <p>
              <strong>이메일:</strong> {data?.email}
            </p>
            <p>
              <strong>전화번호:</strong> {data?.phone}
            </p>
            <p>
              <strong>주소:</strong> {data?.address?.address},{' '}
              {data?.address?.city}, {data?.address?.state}
            </p>
            <p>
              <strong>직장:</strong> {data?.company?.name} -{' '}
              {data?.company?.title}
            </p>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default UserInfoDialog;
