import { useGetUserById } from "@/feature/get-user-by-id"
import { UserSummary } from "@/feature/get-users-summary"
import { useModal } from "@/shared/hooks/useModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Loader } from "@/shared/ui"

interface Props {
  modalId: string
}

export const UserProfileModal = ({ modalId }: Props) => {
  const { close, data: selectedUser, isOpen } = useModal<UserSummary>(modalId)
  const { data: userData, isError, isLoading } = useGetUserById(selectedUser?.id)

  if (isError) {
    return <div className="text-red-500">사용자 정보 조회에 실패했습니다.</div>
  }

  return (
    <Dialog onOpenChange={close} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Loader />
        ) : (
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
                <strong>주소:</strong> {userData?.address?.address}, {userData?.address?.city},{" "}
                {userData?.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {userData?.company?.name} - {userData?.company?.title}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
