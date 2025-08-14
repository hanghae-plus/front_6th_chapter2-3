import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui";
import { UserInfo } from "../../../entities/user/ui/UserModal";
import { UserResponse } from "../../../entities/user/types";
import { showUserModalAtom } from "../model/atoms";
import { useAtom } from "jotai";

export const UserModal = ({
  //   showUserModal,
  //   setShowUserModal,
  selectedUser,
}: {
  //   showUserModal: boolean;
  //   setShowUserModal: (show: boolean) => void;
  selectedUser: UserResponse | null;
}) => {
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom);

  return (
    <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <UserInfo selectedUser={selectedUser} />
      </DialogContent>
    </Dialog>
  );
};
