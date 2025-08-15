import type { ComponentPropsWithoutRef } from "react"

import { mergeClasses } from "@/base/lib"
import type { User } from "@/entities/user/model"

type UserAvatarProps = ComponentPropsWithoutRef<"div"> & {
  user: User
  onUserClick?: (user: User) => void
}

export function UserAvatar({ user, onUserClick, className, ...props }: UserAvatarProps) {
  const handleClick = () => {
    onUserClick?.(user)
  }

  return (
    <div
      className={mergeClasses("flex cursor-pointer items-center space-x-2 hover:opacity-75", className)}
      onClick={handleClick}
      {...props}
    >
      <img src={user.image} alt={user.username} className="h-8 w-8 rounded-full" />
      <span>{user.username}</span>
    </div>
  )
}
