import { User } from "../../../entities/user/model/types"
import { usePostsManager } from "../model/usePostsManager"

interface UserAvatarProps {
  user?: User
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
  const { openUserModal } = usePostsManager()

  if (!user) return null

  return (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => openUserModal(user)}>
      <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full" />
      <span>{user.username}</span>
    </div>
  )
}
