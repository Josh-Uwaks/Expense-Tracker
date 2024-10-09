import { ExtendedUser } from "@/next-auth";
import { useSession } from "next-auth/react";

export default function SignedUserClient() {
    const session = useSession()

    return session?.data?.user as ExtendedUser | undefined

 // Explicitly cast to ExtendedUser
}