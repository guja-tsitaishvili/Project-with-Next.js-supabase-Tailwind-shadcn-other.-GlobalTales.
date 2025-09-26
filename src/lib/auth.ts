import client from "@/api/client"

export async function getCurrentUser() {
  const { data, error } = await client.auth.getUser()
  if (error) {
    console.error("getUser error", error)
    return null
  }
  return data.user // { id, email, ... }
}