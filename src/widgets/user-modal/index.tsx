import { useAtom, useAtomValue } from "jotai"
import { useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../shared/ui"
import UserInfo from "../../entities/users/ui/user-info-card"
import { fetchUserApi } from "../../entities/users/api"
import {
  isUserInfoModalOpenAtom,
  viewingUserIdAtom,
} from "../../features/user-management/model/atoms"

const UserInfoModal = () => {
  const [isOpen, setIsOpen] = useAtom(isUserInfoModalOpenAtom)
  const userId = useAtomValue(viewingUserIdAtom)

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserApi(userId!),
    enabled: !!userId,
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        {isLoading && <div>로딩 중...</div>}
        {user && <UserInfo user={user} />}
      </DialogContent>
    </Dialog>
  )
}

export default UserInfoModal
