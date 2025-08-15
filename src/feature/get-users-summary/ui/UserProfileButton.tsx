import { PropsWithChildren } from "react"

import { UserSummary } from "@/feature/get-users-summary"
import { useModal } from "@/shared/hooks/useModal"

import { UserProfileModal } from "./UserProfileModal"

interface Props {
  user: UserSummary
}

export const UserProfileButton = ({ children, user }: PropsWithChildren<Props>) => {
  const userProfileModal = useModal<UserSummary>(`user-profile-${user.id}`)

  const handleOpenUserProfile = () => {
    userProfileModal.open(user)
  }

  return (
    <>
      <div className="flex items-center space-x-2 cursor-pointer" onClick={handleOpenUserProfile}>
        {children || (
          <>
            <img alt={user.username} className="w-8 h-8 rounded-full" src={user.image} />
            <span>{user.username}</span>
          </>
        )}
      </div>
      <UserProfileModal modalId={`user-profile-${user.id}`} />
    </>
  )
}
