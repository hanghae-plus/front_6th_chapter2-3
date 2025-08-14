import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"

import { DialogHeader } from "../../shared/ui"
import UserInfo from "../../entities/users/ui/user-info-card"
import { UserDto } from "../../entities/users/api"

type Props = {
  user: UserDto
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}
const UserInfoModal = ({ isOpen, onOpenChange, user }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <UserInfo user={user} />
      </DialogContent>
    </Dialog>
  )
}

export default UserInfoModal
