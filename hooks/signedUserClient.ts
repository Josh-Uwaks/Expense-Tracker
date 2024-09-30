import { useSession } from "next-auth/react";

export default function SignedUserClient() {
    const session = useSession()

    return session.data?.user
}