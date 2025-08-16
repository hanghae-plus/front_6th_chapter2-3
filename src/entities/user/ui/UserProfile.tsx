import type { FullUser } from "../model"

type UserProfileProps = {
  user: FullUser
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="space-y-4">
      <img src={user.image} alt={user.username} className="mx-auto h-24 w-24 rounded-full" />
      <h3 className="text-center text-xl font-semibold">{user.username}</h3>
      <div className="space-y-2">
        <p>
          <strong>이름:</strong> {user.firstName} {user.lastName}
        </p>
        <p>
          <strong>나이:</strong> {user.age}
        </p>
        <p>
          <strong>이메일:</strong> {user.email}
        </p>
        <p>
          <strong>전화번호:</strong> {user.phone}
        </p>
        <p>
          <strong>주소:</strong> {user.address.address}, {user.address.city}, {user.address.state}
        </p>
        <p>
          <strong>직장:</strong> {user.company.name} - {user.company.title}
        </p>
      </div>
    </div>
  )
}
