import { User } from "../model/types"
import { FC } from "react"

interface UserAvatarProps {
  user?: User
  onClick: () => void
}

const UserAvatar: FC<UserAvatarProps> = ({ user, onClick }) => {
  if (!user) return null

  return (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={onClick}>
      <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full" />
      <span>{user.username}</span>
    </div>
  )
}

export default UserAvatar
