import { useMemo } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { useDialogStore, useDialogActions } from "@/shared/model"
import { useSelectedUserStore, useUserProfile } from "../model"

export const UserProfileDialog = () => {
  const { selectedUserId } = useSelectedUserStore()
  const { dialogs } = useDialogStore()
  const { hideDialog } = useDialogActions()

  const isOpen = dialogs.USER_INFO
  const hasValidUserId = selectedUserId && selectedUserId > 0

  const { data: user, isLoading, error } = useUserProfile(selectedUserId || 0, Boolean(isOpen && hasValidUserId))

  const userInfoFields = useMemo(
    () => [
      { label: "이름", value: user ? `${user.firstName} ${user.lastName}` : "" },
      { label: "나이", value: user?.age?.toString() || "" },
      { label: "이메일", value: user?.email || "" },
      { label: "전화번호", value: user?.phone || "" },
      {
        label: "주소",
        value: user?.address ? `${user.address.address}, ${user.address.city}, ${user.address.state}` : "",
      },
      { label: "직장", value: user?.company ? `${user.company.name} - ${user.company.title}` : "" },
    ],
    [user],
  )

  if (!isOpen || !hasValidUserId) return null

  const handleClose = () => {
    hideDialog("USER_INFO")
  }

  // 사용자 정보 필드 정의

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <p>로딩 중...</p>
        </div>
      )
    }

    if (error || !user) {
      return (
        <div className="space-y-4">
          <div className="flex justify-center items-center py-8">
            <p className="text-red-500">사용자 정보를 불러올 수 없습니다.</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleClose}>닫기</Button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <img src={user.image} alt={user.username} className="w-24 h-24 rounded-full mx-auto" />
        <h3 className="text-xl font-semibold text-center">{user.username}</h3>

        <div className="space-y-2">
          {userInfoFields.map(
            ({ label, value }) =>
              value && (
                <p key={label}>
                  <strong>{label}:</strong> {value}
                </p>
              ),
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleClose}>닫기</Button>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}
