import { UserProfile } from "@/entities/user/ui"
import { useUserQuery } from "@/features/get-user/api"
import { DialogType, useDialogStore } from "@/shared/lib"
import { Dialog } from "@/shared/ui"

type UserInfoDialogProps = {
  userId: number
}

export function UserInfoDialog({ userId }: UserInfoDialogProps) {
  const currentDialog = useDialogStore((state) => state.currentDialog)
  const { closeDialog } = useDialogStore((state) => state.actions)
  const isOpen = currentDialog === DialogType.USER_MODAL

  const { data: user, isLoading } = useUserQuery({ id: userId })

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>사용자 정보</Dialog.Title>
        </Dialog.Header>
        {!isLoading && user ? <UserProfile user={user} /> : <div className="flex justify-center p-4">로딩 중...</div>}
      </Dialog.Content>
    </Dialog>
  )
}
