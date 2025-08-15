import { useUserStore } from '../../../../entities/user/model/store';
import { useDialogStore } from '../../../../shared/store/dialog';
import { DIALOG_KEYS } from '../../../../shared/constant/dialog';
import { fetchUserDetail } from '../../../../entities/user/api/api';

export const useViewUser = () => {
  const { selectedUser, setSelectedUser } = useUserStore();
  const { isDialogOpen, closeDialog, openDialog } = useDialogStore();

  const openUserModal = async (user: { id: number }) => {
    try {
      const userData = await fetchUserDetail(user.id);
      setSelectedUser(userData);
      openDialog(DIALOG_KEYS.USER_MODAL);
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
    }
  };

  return {
    selectedUser,
    isDialogOpen: isDialogOpen(DIALOG_KEYS.USER_MODAL),
    closeDialog: () => closeDialog(DIALOG_KEYS.USER_MODAL),
    openUserModal,
  };
};
