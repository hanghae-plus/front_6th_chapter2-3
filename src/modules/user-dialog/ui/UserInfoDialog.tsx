import { DialogType, useDialogStore } from "@/base/lib"
import { Dialog } from "@/base/ui"
import { UserProfile } from "@/entities/user/ui"
import { useUserQuery } from "@/features/get-user/api"
import { useUserDialogStore } from "@/features/get-user/model"

export function UserInfoDialog() {
  const currentDialog = useDialogStore((state) => state.currentDialog)
  const { closeDialog } = useDialogStore((state) => state.actions)
  const { selectedUserId } = useUserDialogStore((state) => state)

  const isOpen = currentDialog === DialogType.USER_MODAL
  const { data: user, isLoading } = useUserQuery({ id: selectedUserId || 0 })

  if (!selectedUserId) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>사용자 정보</Dialog.Title>
          <Dialog.Description></Dialog.Description>
        </Dialog.Header>
        {!isLoading && user ? <UserProfile user={user} /> : <div className="flex justify-center p-4">로딩 중...</div>}
      </Dialog.Content>
    </Dialog>
  )
}
