import { requireAuth } from "@/lib/auth-utils"


export default async function Page() {
  requireAuth()
  return (
    <div>Credentials Page</div>
  )
}
