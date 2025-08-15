import { User } from "@/entities/user"
import { useModal } from "@/shared/hooks/useModal"

export const useUserProfileModal = () => {
  return useModal<User>("userProfile")
}
