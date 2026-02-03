
import { getUsers } from "@/app/actions"
import SettingsClientPage from "./client-page"

export default async function SettingsPage() {
  const users = await getUsers()
  return <SettingsClientPage initialUsers={users} />
}
