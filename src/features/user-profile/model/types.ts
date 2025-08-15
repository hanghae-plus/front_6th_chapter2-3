import { User } from '../../../entities/user/model/types'

export interface UserProfileModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}
