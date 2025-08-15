import { Loader2 } from 'lucide-react';

import { useGetUserQuery } from '@/entities/user';
import { useUIStore } from '@/shared/lib';
import { ContentDialog } from '@/shared/ui';

export const UserProfileDialog = () => {
  const { selectedUser, showUserModal, setShowUserModal } = useUIStore();

  const { data: user, isLoading } = useGetUserQuery(selectedUser?.id ?? null);

  if (!selectedUser) return null;

  return (
    <ContentDialog
      open={showUserModal}
      onOpenChange={setShowUserModal}
      title='사용자 정보'
    >
      {isLoading ? (
        <div className='flex justify-center items-center h-full'>
          <Loader2 className='w-6 h-6 animate-spin' />
        </div>
      ) : (
        <div className='space-y-4'>
          <img
            src={user?.image}
            alt={user?.username ?? ''}
            className='w-24 h-24 rounded-full mx-auto'
          />
          <h3 className='text-xl font-semibold text-center'>
            {user?.username}
          </h3>
          <div className='space-y-2'>
            <p>
              <strong>이름:</strong> {user?.firstName} {user?.lastName}
            </p>
            <p>
              <strong>나이:</strong> {user?.age}
            </p>
            <p>
              <strong>이메일:</strong> {user?.email}
            </p>
            <p>
              <strong>전화번호:</strong> {user?.phone}
            </p>
            <p>
              <strong>주소:</strong> {user?.address?.address},{' '}
              {user?.address?.city}, {user?.address?.state}
            </p>
            <p>
              <strong>직장:</strong> {user?.company?.name} -{' '}
              {user?.company?.title}
            </p>
          </div>
        </div>
      )}
    </ContentDialog>
  );
};
