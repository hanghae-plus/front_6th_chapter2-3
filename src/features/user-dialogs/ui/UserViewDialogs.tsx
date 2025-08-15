import { useGetUser } from "@/entities/post/hook/useUser"
import { User } from "@/entities/post/model"
import { useDialog } from "@/shared/hook/useDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"

interface UserViewDialogsProps {
  user: User
}

export const UserViewDialogs = ({ user }: UserViewDialogsProps) => {
  const { data: userData, isLoading } = useGetUser(user.id)

  const { open: openUserInfoDialog, isOpen: isUserInfoDialogOpen } = useDialog("user-info")

  if (isLoading) return <div>Loading...</div>

  return (
    <Dialog onOpenChange={openUserInfoDialog} open={isUserInfoDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img alt={userData?.username} className="w-24 h-24 rounded-full mx-auto" src={userData?.image} />
          <h3 className="text-xl font-semibold text-center">{userData?.username}</h3>
          <div className="space-y-2">
            <p>
              <strong>이름:</strong> {userData?.firstName} {userData?.lastName}
            </p>
            <p>
              <strong>나이:</strong> {userData?.age}
            </p>
            <p>
              <strong>이메일:</strong> {userData?.email}
            </p>
            <p>
              <strong>전화번호:</strong> {userData?.phone}
            </p>
            <p>
              <strong>주소:</strong> {userData?.address?.address}, {userData?.address?.city}, {userData?.address?.state}
            </p>
            <p>
              <strong>직장:</strong> {userData?.company?.name} - {userData?.company?.title}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
