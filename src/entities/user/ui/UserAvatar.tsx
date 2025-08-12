import { User } from "../model/types"
import { useUserManagement } from "../../../features/userManagement/model/useUserManagement"

interface UserAvatarProps {
  user?: User
}

const UserAvatar: FC<UserAvatarProps> = ({ user }) => {
  const { openUserModal } = useUserManagement()

  if (!user) return null

  return (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => openUserModal(user)}>
      <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full" />
      <span>{user.username}</span>
    </div>
  )
}

export default UserAvatar
