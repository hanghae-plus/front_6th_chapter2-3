import type { ComponentPropsWithoutRef } from "react"

import { mergeClasses } from "@/base/lib"
import type { User } from "@/entities/user/model"

type UserAvatarProps = Omit<ComponentPropsWithoutRef<"div">, "onClick"> & {
  user: User
  onUserClick?: (user: User) => void
}

export function UserAvatar({ user, onUserClick, className, ...rest }: UserAvatarProps) {
  const handleClick = () => {
    onUserClick?.(user)
  }

  return (
    <div className={mergeClasses("flex items-center space-x-2", className)} onClick={handleClick} {...rest}>
      <img src={user.image} alt={user.username} className="h-8 w-8 rounded-full" />
      <span>{user.username}</span>
    </div>
  )
}
