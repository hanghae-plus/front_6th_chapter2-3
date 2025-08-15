import type { ComponentPropsWithoutRef } from "react"

import { DialogType, mergeClasses, useDialogStore } from "@/base/lib"
import type { User } from "@/entities/user/model"
import { useUserDialogStore } from "@/features/get-user/model"

type UserAvatarProps = ComponentPropsWithoutRef<"div"> & {
  user?: User
}

export function UserAvatar({ user, className, ...rest }: UserAvatarProps) {
  const { openDialog } = useDialogStore((state) => state.actions)
  const { setSelectedUserId } = useUserDialogStore((state) => state.actions)

  const handleClick = () => {
    if (!user) return
    setSelectedUserId(user.id)
    openDialog(DialogType.USER_MODAL)
  }

  if (!user) {
    return null
  }

  return (
    <div
      className={mergeClasses("flex cursor-pointer items-center space-x-2 hover:opacity-75", className)}
      onClick={handleClick}
      {...rest}
    >
      <img src={user.image} alt={user.username} className="h-8 w-8 rounded-full" />
      <span>{user.username}</span>
    </div>
  )
}
