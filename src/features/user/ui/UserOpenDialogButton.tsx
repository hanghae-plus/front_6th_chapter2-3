// features/user/ui
import type { User } from "@/entities/User/model/User.ts"
import { useUserModal } from "@/features/user/model/useUserModal.ts"

export function UserOpenDialogButton({ user }: { user: User }) {
  const { openUserModal } = useUserModal()

  async function handleUserModalOpen(user: User) {
    await openUserModal(user)
  }

  return (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleUserModalOpen(user)}>
      <img src={user?.image} alt={user?.username} className="w-8 h-8 rounded-full" />
      <span>{user?.username}</span>
    </div>
  )
}
