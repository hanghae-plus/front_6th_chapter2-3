import { useUserModal } from '../model';
import { useUser } from '@/entities/users';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui';

interface OpenUserDetailButtonProps {
  userId: number | null | undefined;
  image: string;
  username: string;
}

export const OpenUserDetailButton = ({
  userId,
  image,
  username,
}: OpenUserDetailButtonProps) => {
  const { open: openUserModal } = useUserModal();

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={() => {
        if (userId) {
          openUserModal(userId);
        }
      }}
    >
      <img src={image} alt={username} className="w-8 h-8 rounded-full" />
      <span>{username}</span>
    </div>
  );
};

// 사용자 상세 모달
export const UserDialog = () => {
  const { opened, userId, close } = useUserModal();
  const { data: user } = useUser(userId || undefined);

  if (!user) {
    return null;
  }

  return (
    <Dialog open={opened} onOpenChange={(opened) => !opened && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img
            src={user.image}
            alt={user.username}
            className="w-24 h-24 rounded-full mx-auto"
          />
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
              <strong>주소:</strong> {user.address?.address},{' '}
              {user.address?.city}, {user.address?.state}
            </p>
            <p>
              <strong>직장:</strong> {user.company?.name} -{' '}
              {user.company?.title}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
