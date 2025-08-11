import { User, Users } from "./type"

export const getUsers = async () => {
  const res = await fetch("/api/users?limit=0&select=username,image")

  if (!res.ok) {
    return { result: false }
  }

  const users = (await res.json()) as Users

  return { result: true, users }
}

export const getUser = async (id: number) => {
  const res = await fetch(`/api/users/${id}`)

  if (!res.ok) {
    return { result: false }
  }

  const user = (await res.json()) as User

  return { result: true, user }
}
