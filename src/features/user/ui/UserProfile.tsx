import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../shared/ui';
import { User } from '../../../entities/user';
import { useUser } from '../hooks/useUserQueries';

interface UserProfileProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export const UserProfile = ({ isOpen, onOpenChange, user }: UserProfileProps) => {
  // TanStack Query로 사용자 데이터 가져오기 (props의 user가 기본값)
  const { data: userData, isLoading, error } = useUser(user?.id || 0);

  // props의 user 또는 TanStack Query 데이터 사용
  const displayUser = userData || user;

  if (!displayUser) return null;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className='flex justify-center p-4'>
            <div>사용자 정보를 불러오는 중...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className='flex justify-center p-4 text-red-500'>
            <div>사용자 정보를 불러오는 중 오류가 발생했습니다.</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <img
            src={displayUser.image}
            alt={displayUser.username}
            className='w-24 h-24 rounded-full mx-auto'
          />
          <h3 className='text-xl font-semibold text-center'>{displayUser.username}</h3>
          <div className='space-y-2'>
            <p>
              <strong>이름:</strong> {displayUser.firstName} {displayUser.lastName}
            </p>
            <p>
              <strong>나이:</strong> {displayUser.age}
            </p>
            <p>
              <strong>이메일:</strong> {displayUser.email}
            </p>
            <p>
              <strong>전화번호:</strong> {displayUser.phone}
            </p>
            <p>
              <strong>주소:</strong> {displayUser.address?.address}, {displayUser.address?.city},{' '}
              {displayUser.address?.state}
            </p>
            <p>
              <strong>직장:</strong> {displayUser.company?.name} - {displayUser.company?.title}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
